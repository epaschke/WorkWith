var React = require('react');
var { EditorState, convertFromRaw, convertToRaw, SelectionState } = require('draft-js');
const { MyEditor } = require('./MyEditor');
const { Static } = require('./Static');

var axios = require('axios');
const io = require('socket.io');


class DocContainer extends React.Component {
  constructor(props){
    super(props);
    console.log('props: ', this.props.match);
    const id = this.props.match.params.docId;
    this.state = {
      id: id,
      loading: true,
      title: '',
      editorState: EditorState.createEmpty(),
      currentSelection: SelectionState.createEmpty(),
      socket: io.connect('http://localhost:3000', { transports: ['websocket'] })
    };

    this.state.socket.on('connect', () => {
      console.log('connected');
      this.state.socket.emit('join', this.state.id);
    });

    axios.get('http://localhost:3000/document/' + this.state.id)
    .then(function (response) {
      console.log('got response: ', response.data);
      this.setState({
        title: response.data.title,
        editorState: response.data.editorRaw ? EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.editorRaw))) : this.state.editorState,
        currentSelection: response.data.editorRaw ? EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.editorRaw))).getSelection() : this.state.currentSelection,
        loading: false
      });
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });

    this.onChange = (editorState) => {
      this.state.socket.emit('typing', JSON.stringify(convertToRaw(editorState.getCurrentContent())));
      this.state.socket.emit('selection', {
        anchorOffset: editorState.getSelection().getAnchorOffset(),
        focusOffset: editorState.getSelection().getFocusOffset(),
        anchorKey: editorState.getSelection().getAnchorKey(),
        focusKey: editorState.getSelection().getFocusKey(),
        isCollapsed: editorState.getSelection().isCollapsed(),
        isBackward: editorState.getSelection().getIsBackward()
      });
      this.setState({editorState, currentSelection: editorState.getSelection()});
    };
  }

  setStateFn(toSet){
    this.setState({
      editorState: toSet
    });
  }

  componentWillMount(){
    this.state.socket.on('changestate', (newState) => {
      this.setState({
        editorState: EditorState.forceSelection(EditorState.createWithContent(convertFromRaw(JSON.parse(newState))), this.state.currentSelection)
      });
    });
  }

  save(){
    axios.post('http://localhost:3000/save', {
      docId: this.state.id,
      title: this.state.title,
      editorState: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
    })
    .then(function(response){
      console.log('got response from save: ', response);
      if (response.data.success){
        console.log('saved');
      } else {
        console.log('error saving');
      }
    })
    .catch(function(error){
      console.log(error);
    });
  }

  leaveDoc(){
    this.state.socket.emit('leave');
  }

  render(){
    return (<div>
              <Static loading={this.state.loading} docId={this.state.id} title={this.state.title} leaveDoc={this.leaveDoc.bind(this)} saveFn={this.save.bind(this)} />
              <MyEditor docId={this.state.id} currentSelection={this.state.Selection} editorState={this.state.editorState} onChangeFn={this.onChange} socket={this.state.socket} setStateFn={this.setStateFn.bind(this)}/>
            </div>);
  }
 }





module.exports = { DocContainer };
