import React from "react";
import TutorialDataService from '../services/tutorial.service';
import { Link } from 'react-router-dom';

class TutorialsList extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveTutorials = this.retrieveTutorials.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.removeAllTutorials = this.removeAllTutorials.bind(this);
        this.setActiveTutorial = this.setActiveTutorial.bind(this);
        this.searchTitle = this.searchTitle.bind(this);
        this.state = {
            tutorials: [],
            currentTutorial: null,
            currentIndex: -1,
            searchTitle: ""
        };
    }
    componentDidMount() {
        this.retrieveTutorials();
    }
    onChangeSearchTitle(e) {
        this.setState({
            searchTitle: e.target.value
        })
    }
    retrieveTutorials() {
        TutorialDataService.getAll().then(response => {
            this.setState({
                tutorials: response.data
            })
            console.log(response.data);
        }).catch(e => console.log(e))
    }
    refreshList() {
        this.retrieveTutorials();
        this.setState({
            currentTutorial: null,
            currentIndex: -1
        })
    }
    setActiveTutorial(tutorial, index) {
        this.setState({
            currentTutorial: tutorial,
            currentIndex: index
        })
    }
    removeAllTutorials() {
        TutorialDataService.deleteAll().then(response => {
            console.log(response.data);
            this.refreshList()
        }).catch(e => console.log(e))
    }
    searchTitle() {
        TutorialDataService.findByTitle(this.state.searchTitle)
            .then(response => {
                this.setState({
                    tutorials: response.data
                })
                console.log(response.data);
            }).catch(e => console.log(e))
    }
    render() {
        const { searchTitle, tutorials, currentTutorial, currentIndex } = this.state;
        return (
            <div className='list row'>
                <div className='col-md-8'>
                    <div className="input-group mb-3">
                        <input type='text' className='form-control' placeholder='Search by title ...'
                            value={searchTitle} onChange={this.onChangeSearchTitle} />
                        <div className='input-group-append'>
                            <button className='btn btn-dark' onClick={this.searchTitle}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <h4>Tutorial List</h4>
                    <ul className='list-group'>
                        {
                            tutorials
                            && tutorials.map((tutorial, index) => (
                                <li className={'list-group-item' + (index === currentIndex ? ' active' : '')}
                                    onClick={() => this.setActiveTutorial(tutorial, index)}
                                    key={index}>
                                    {tutorial.title}
                                </li>
                            ))
                        }
                    </ul>
                    <button className='btn btn-danger' onClick={this.removeAllTutorials} style={{marginTop : 5+'px'}}>
                        Remove All
                    </button>
                </div>
                <div className='col-md-6'>
                    {
                        currentTutorial ? (
                            <div>
                                <h4>Tutorial</h4>
                                <div>
                                    <label><strong>Title:</strong></label>{' '}{currentTutorial.title}
                                </div>
                                <div>
                                    <label><strong>Description:</strong></label>{' '}{currentTutorial.descripton}
                                </div>
                                <div>
                                    <label>
                                        <strong>Status:</strong>
                                    </label>{" "}
                                    {currentTutorial.published ? "Published" : "Pending"}
                                </div>
                                <Link to={'/tutorials/' + currentTutorial.id}
                                    className='badge bg-warning'>Edit</Link>
                            </div>
                        ) : (
                            <div>
                                <br />
                                <p>Please click on a Tutorial...</p>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default TutorialsList;