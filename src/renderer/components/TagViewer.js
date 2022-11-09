import React from 'react';

export default function TagViewer({ selectedNode }) {
    return <span>{selectedNode.selection.url}</span>;
}