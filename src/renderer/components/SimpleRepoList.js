import * as React from "react";

export default class SimpleRepoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repos: []
        };
    }

    componentDidMount() {
        window.repo.list().then((list) => {
            this.setState({repos: list})
        });
    }

    render() {
        const {repos} = this.state;
        return (<ul>{repos.map((repo) => (<li>{repo.full_name}</li>))}</ul>);
    }
}