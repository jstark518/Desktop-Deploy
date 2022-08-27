import React, { useState, useEffect } from 'react';

/**
 * @property {[Repo]} repos
 * @returns {JSX.Element|string}
 * @constructor
 */
export default function SimpleRepoList()  {
    const [repos, setRepos] = useState(null);

    useEffect(() => {
        window.repo.list().then((list) => {
            setRepos(list);
        });
    })

    if(repos == null) return 'Loading...';

    return (<ul>{repos.map((repo) => (<li>{repo.name}<Branches branches={repo.branches}></Branches></li>))}</ul>);
}

/**
 *
 * @returns {JSX.Element}
 * @constructor
 * @property {[Branch]} branches
 */
function Branches(props) {
    const {branches} = props;
    return (<ul>{branches.map((branch) => (<li>{branch.name}</li>))}</ul>);
}