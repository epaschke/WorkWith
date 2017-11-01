var React = require('react');
var { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } = require('draft-js');
var { Link } = require('react-router-dom');
const { styleMap } = require('../styleMap');
console.log('styleMap: ', styleMap);
var axios = require('axios');

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

class DocContainer extends React.Component {
  constructor(props){
    super(props);
    console.log('props: ', this.props.match);
    const id = this.props.match.params.docId;
    this.state = {
      id: id,
      loading: true,
      title: '',
      editorState: EditorState.createEmpty()
    }
    this.onChange = (editorState) => this.setState({editorState});
  }

  componentWillMount(){
    console.log('this.state:', this.state);
    axios.get('http://localhost:3000/document/' + this.state.id)
    .then(function (response) {
      console.log('got response: ', response.data);
      this.setState({
        title: response.data.title,
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.editorRaw))),
        loading: false
      });
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }

  save(){
    console.log('converttoraw:', convertToRaw(this.state.editorState.getCurrentContent()));
    console.log('editorState state: ', this.state.editorState);
    axios.post('http://localhost:3000/save',
    { docId: this.state.id, title: this.state.title, editorState: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())) })
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
    })
  }

  render(){
    return (
            <div>
                <Static loading={this.state.loading} docId={this.state.id} title={this.state.title} saveFn={this.save.bind(this)} />
                <MyEditor editorState={this.state.editorState} onChangeFn={this.onChange} />
            </div>
    );
  }
}

class Static extends React.Component {
  render(){
    return (
            <div style={{display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
                <Link to="/home" className="btn-floating btn-large waves-effect waves-light red">
                  <i className="material-icons">keyboard_return</i>
                </Link>
                <div><h3>{!this.props.loading && <b>{this.props.title}</b>}</h3>
                <p>ID: {this.props.docId}</p></div>
                <a className="btn-floating btn-large waves-effect waves-light blue"
                   onClick={this.props.saveFn}>
                  <i className="material-icons">save</i>
                </a>
            </div>
    );
  }
}

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {size: 12};
  }

  _onColorSelect(){
    var color = document.getElementById('colorSelect').value;
    var colorArr = color.split('');
    colorArr[0] = colorArr[0].toUpperCase();
    color = colorArr.join('');
    this._onToggleInline(`text${color}`).bind(this);
  }

  _onBackgroundColorSelect(){
    var color = document.getElementById('backgroundColorSelect').value;
    var colorArr = color.split('');
    colorArr[0] = colorArr[0].toUpperCase();
    color = colorArr.join('');
    this._onToggleInline(`background${color}`).bind(this);
  }

  _onFontStyleSelect(){
    var font = document.getElementById('fontStyleSelect').value;
    console.log('font: ', font);
    switch (font) {
      case 'monospace':
        this._onMonospace();
        break;
      case 'times new roman':
        this._onTimes();
        break;
      case 'cambria':
        this._onMonospace();
        break;
      default:
        break;

    }
  }

  _onToggleInline(type){
    this.props.onChangeFn(RichUtils.toggleInlineStyle(this.props.editorState, type));
  }

  _onFont(){
    var font = document.getElementById('fontStyleSelect').value;
    console.log('font: ', font);
    this.props.onChangeFn(RichUtils.toggleInlineStyle(this.props.editorState, font));
  }

  _onSizeSelect(){
    let size = document.getElementById('slider1').value;
    this.setState({
      size
    });
    this._onToggleInline(`fontSize${this.state.size}`).bind(this);
  }

  _onToggleBlock(type){
    this.props.onChangeFn(RichUtils.toggleBlockType(this.props.editorState,type));
  }

  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    console.log('contentBlock: ', contentBlock);
    console.log('type: ', type);
    switch (type) {
    case 'leftAlign':
      return 'leftAlign';
    case 'rightAlign':
      return 'rightAlign';
    case 'centerAlign':
      return 'centerAlign';
    default:
      return 'leftAlign';
    }
  }

  render() {
    return (
        <div>
            <div>
                <div style={{display: 'flex'}}>
                  <div style={{flex: 1}}>
                    <input id="slider1" type="range" min="12" max="108" step="12" defaultValue="12" onChange={this._onSizeSelect.bind(this)}/>
                    <div style={{width: 80}}>
                      Size: {this.state.size}
                    </div>
                  </div>
                 <select id='fontStyleSelect' className='dropdown-button btn' href='#' style={{margin: 5}} onChange={this._onFontStyleSelect.bind(this)}>
                   <option>-font-</option>
                   <option value="cambria">Cambria</option>
                   <option value="monospace">Monospace</option>
                   <option value="times new roman">Times New Roman</option>
                </select>

               <select id='colorSelect' className='dropdown-button btn' href='#' style={{margin: 5}} onChange={this._onColorSelect.bind(this)}>
                 <option>-color-</option>
                 <option value="red">red</option>
                 <option value="blue">blue</option>
                 <option value="green">green</option>
                 <option value="yellow">yellow</option>
              </select>

              <select id='backgroundColorSelect' className='dropdown-button btn' href='#' style={{margin: 5}} onChange={this._onBackgroundColorSelect.bind(this)}>
                <option>-background-</option>
                <option value="red">red</option>
                <option value="blue">blue</option>
                <option value="green">green</option>
                <option value="yellow">yellow</option>
             </select>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-around'}}>
                 <a className="waves-effect waves-teal btn-flat" onClick={() => this._onToggleInline('BOLD')}><i className="material-icons">format_bold</i></a>
                 <a className="waves-effect waves-teal btn-flat" onClick={() => this._onToggleInline('ITALIC')}><i className="material-icons">format_italic</i></a>
                 <a className="waves-effect waves-teal btn-flat" onClick={() => this._onToggleInline('UNDERLINE')}><i className="material-icons">format_underlined</i></a>
                 <a className="waves-effect waves-teal btn-flat" onClick={() => this._onToggleBlock('leftAlign')}><i className="material-icons">format_align_left</i></a>
                 <a className="waves-effect waves-teal btn-flat" onClick={() => this._onToggleBlock('centerAlign')}><i className="material-icons">format_align_center</i></a>
                 <a className="waves-effect waves-teal btn-flat" onClick={() => this._onToggleBlock('rightAlign')}><i className="material-icons">format_align_right</i></a>
                 <a className="waves-effect waves-teal btn-flat"><i className="material-icons" onClick={() => this._onToggleBlock('unordered-list-item')}>format_list_bulleted</i></a>
                 <a className="waves-effect waves-teal btn-flat"><i className="material-icons" onClick={() => this._onToggleInline('ordered-list-item')}>format_list_numbered</i></a>
                 <a className="waves-effect waves-teal btn-flat" onClick={() => this._onToggleInline('STRIKETHROUGH')}><i className="material-icons">format_strikethrough</i></a>
             </div>
         </div>
            <div style={{border: "1px solid gray", minHeight: 300, margin: 20}}>
                <Editor spellCheck={true} blockStyleFn={this.myBlockStyleFn} customStyleMap={styleMap} editorState={this.props.editorState} handleKeyCommand={this.handleKeyCommand} onChange={this.props.onChangeFn}/>
            </div>
        </div>
    );
  }
}

module.exports = { DocContainer };
