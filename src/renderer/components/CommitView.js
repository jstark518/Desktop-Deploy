import React from 'react';
import {useState, useEffect} from 'react';


export default function CommitView({selectedNode}) {
    return (
        <span>{JSON.stringify({selectedNode})}</span>
    );
}