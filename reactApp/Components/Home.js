var React = require('react');
var { Link } = require('react-router-dom');
var axios = require('axios');

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title: '',
      documents: [],
    }
  }

  docChange(e){
    console.log('docName', e.target.value);
    this.setState({
      title: e.target.value,
    });
  }

  createDoc(e){
    e.preventDefault();
    axios.post('http://localhost:3000/newDocument', {
      title: this.state.title,
    })
    .then((res) => {
      this.setState({
        documents: [...this.state.documents, res.data.doc]
      })
    })
    .catch(function(error){
        console.log('Error', error);
    });
  }

  componentWillMount(){
    // axios request
    axios.get('http://localhost:3000/documents')
    .then(function (response) {
      this.setState({
        documents: response.data
      })
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }

  render(){
    return (<div style={{padding:20}}>
      <div className="row">
        <form className="col s12">
          <div className="input-field col s6" style={{border: '1px solid black', display: 'flex', alignItems: 'center'}}>
            <input placeholder="Document name.." name="docName" type="text" className="validate" onChange={(e) => this.docChange(e)} value={this.state.title}/>
            <button className="btn-small waves-effect waves-light blue" type="submit" name="action" onClick={(e) => this.createDoc(e)}>Create
              <i className="material-icons right">send</i>
            </button>
          </div>
        </form>
      </div>
      <div style={{
        display: 'flex',
        border: '2px solid #a1a1a1',
        background: '#dddddd',
        minWidth: 300,
        minHeight: 300,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'column'
      }}>
      <div style={{fontSize: 20, fontWeight: 'bold',justifyContent: 'space-around'}}>
        Los documentos
      </div>
    <ul>
      {this.state.documents.map((doc) => {
        return <li key={doc._id}>
          <Link to={{pathname: `/document/${doc._id}`}}>{doc.title} </Link>
        </li>
      })}
    </ul>
    </div>
  </div>);
}
}

module.exports = { Home };
