import React,{useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import RepositoryTable from './RepositoryTable';


export default function MainContainer() {
  return (
    <div>
        <h2 className='test'>Hello app</h2>
        <RepositoryTable/>
    </div>
  )
}
