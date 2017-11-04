var React = require('react');
var { Link } = require('react-router-dom');
var axios = require('axios');
var { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, SelectionState } = require('draft-js');

class RevisionHistory extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.match.params.docId,
      history: [],
      title: '',
      selected: '',
      selectedContent: ''
    }
  }

  componentWillMount(){
    axios.get(`http://localhost:3000/document/${this.state.id}`)
    .then(function (response) {
      console.log('got this: ', response.data)
      console.log('selected: ', EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.editorRaw))).getCurrentContent().getPlainText());
      this.setState({
        title: response.data.title,
        history: response.data.history,
        selectedText: EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.editorRaw))).getCurrentContent().getPlainText(),
        selectedContent: EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.editorRaw))).getCurrentContent()
      })
    }.bind(this))
    .catch(function (error) {
      console.log('error: ', error);
    });
  }

  selectDoc(doc){
    this.setState({
      selectedText: EditorState.createWithContent(convertFromRaw(JSON.parse(doc.editorState))).getCurrentContent().getPlainText(),
      selectedContent: EditorState.createWithContent(convertFromRaw(JSON.parse(doc.editorState))).getCurrentContent()
    })
  }

  restore(){
    console.log('JSON.parse: ', this.state.selectedContent);
    axios.post(`http://localhost:3000/update/${this.state.id}`, {
      editorState: JSON.stringify(convertToRaw(this.state.selectedContent)),
      docId: this.state.id
    })
    .then((response) => {
      console.log('got: ', response);
    })
    .catch(function(error){
        console.log('Error', error);
    });
  }

  render(){
    return (<div style={{display: 'flex', flexDirection: 'column'}}>
      <h2>{this.state.title}</h2>
      <div style={{display: 'flex'}}>
        <div style={{display: 'flex', 'flex': 2, flexDirection: 'column'}}>
          <div style={{width: 300, height: 200, border: '1px solid black', overflow: 'scroll'}}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

            Why do we use it?

            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
          </div>

          <div style={{padding: 10}}></div>

          <div style={{width: 300, height: 200, border: '1px solid black', overflow: 'scroll'}}>
            {this.state.selectedText}
          </div>
        </div>
        <div style={{display: 'flex', 'flex': 1, width: 90, height: 250, border: '1px solid black', overflow: 'scroll', flexDirection: 'column'}}>
          <p>History: </p>
          <div style={{display: 'flex', flexDirection: 'column', overflow: 'scroll'}}>
            {this.state.history.map((doc) => (
                <div onClick={() => this.selectDoc(doc)} className="btn-flat blue">
                  {doc.date}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div style={{display: "flex", alignItems: 'center'}}>
        <div className="btn-flat blue" onClick={this.restore.bind(this)}> Restore</div>
      </div>
    </div>);
  }
}

module.exports = {RevisionHistory};
