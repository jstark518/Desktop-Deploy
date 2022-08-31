import React, { useState, useEffect } from 'react';

export default function SimpleRepoList()  {
    const [
        repos,
        setRepos
    ] = useState(/** @type {Repo[]} */null);

    useEffect(() => {
        if(repos == null) {
            window.repo.list().then((list) => {
                setRepos(list);
            });
        }
    })

    if(repos == null) return 'Loading...';

    return (<ul>{repos.map((repo) => (<li>{repo.name} {repo.url} <Branches branches={repo.branches}></Branches></li>))}</ul>);
}

function Branches(props) {
    const {
        /** @type {Branch[]} */ branches
    } = props;
    return (<ul>{branches.map((branch) => (<li>{branch.name}</li>))}</ul>);
}