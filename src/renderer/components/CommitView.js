import React from 'react';
import {useState, useEffect} from 'react';


export default function CommitView({selectedNode}) {
    if(selectedNode == null) return (<span>Select a Repo</span>);

    const commit = selectedNode.selection.type == "commit" ? selectedNode.selection : selectedNode.repo.commits.find((e) => e.hash == selectedNode.selection.commitHash);

    console.log(selectedNode.selection);
    if(selectedNode.selection.type === "repo") {
        return (<DefaultRepoView selectedNode={selectedNode}/>)
    }
    if(selectedNode.selection.type === "branch") {
        return (<BranchView selectedNode={selectedNode}/>)
    }
    if(selectedNode.selection.type === "tag") {
        return (<TagView selectedNode={selectedNode}/>)
    }   
    if(selectedNode.selection.type === "commit") {
        return (<CommitDetailView selectedNode={selectedNode}/>)
    }
}


export function DefaultRepoView({selectedNode}) {
    const url = selectedNode.selection.url;
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url).then((response) => response.json())
            .then((data) => {
                setData(data)
            });
    }, [url]);
    console.log(data);

    const clone = () => {
        console.log(selectedNode.repo.clone);
        window.repo.clone(selectedNode.repo.clone, selectedNode.selection).then((resp) => console.log(resp));
    };

    // In case data has not been set
    if(data == null) return (<span>Loading....</span>);

    return (
        <div>
            <button onClick={clone}>Clone</button>
            {console.log(data)}
            <span>{data.description}</span>
        </div>
    )
}


export function BranchView({selectedNode}) {
    const url = selectedNode.selection.url;
    const [data, setData] = useState(null);
    console.log(selectedNode);

    useEffect(() => {
        fetch(url).then((response) => response.json())
            .then((data) => {
                console.log(data);
                setData(data)
            });
    }, [url]);
    console.log(data);
    const clone = () => {
        console.log(selectedNode.repo.clone);
        window.repo.clone(selectedNode.repo.clone, selectedNode.selection);
    };
    
    if(data == null) return (<span>Loading....</span>);

    return (
        <div>
            <button onClick={clone}>Clone</button>
            <span>{data.commit.message}</span>
            <table>
                <thead>
                    <tr>
                        <th>filename</th>
                        <th>add/del</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.files.map((file, index) => FileChanged(index, {file}))}
                </tbody>
            </table>
        </div>
    )
}

export function TagView({selectedNode}) {
    return (<span>{selectedNode.selection.url}</span>);
}

export function CommitDetailView({selectedNode}) {
    return (<span>{selectedNode.selection.url}</span>);
}

export function FileChanged(index, {file}) {
    /*
    files: Array(10)
0:
additions: 2
blob_url: "https://github.com/jstark518/Desktop-Deploy/blob/3824a4009637cfa0f0bb0c0adc7abcf7a5e81c60/.gitignore"
changes: 2
contents_url: "https://api.github.com/repos/jstark518/Desktop-Deploy/contents/.gitignore?ref=3824a4009637cfa0f0bb0c0adc7abcf7a5e81c60"
deletions: 0
filename: ".gitignore"
patch: "@@ -107,3 +107,5 @@ dist\n /.tmp/\n /.idea/\n /.env.json\n+/.cache.data.gh.json\n+.DS_Store"
raw_url: "https://github.com/jstark518/Desktop-Deploy/raw/3824a4009637cfa0f0bb0c0adc7abcf7a5e81c60/.gitignore"
sha: "3655ab548616dba12cafa1ec9b3793b1f34b84fe"
status: "modified"
     */
    return (
        <tr key={file.filename + index}>
            <td>{file.filename}</td>
            <td>+{file.additions} -{file.deletions} lines</td>
            <td>{file.status}</td>
        </tr>

    );
}