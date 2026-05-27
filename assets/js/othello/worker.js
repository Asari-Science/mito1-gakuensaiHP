console.log = function() {};
importScripts('ai.js');

let wasmModule = null;

Module({
    printErr: function(text) {
        postMessage({ type: 'log', text: text + '\n' });
    }
}).then(instance => {
    wasmModule = instance;
    wasmModule.ccall('init_ai', null, [], []);
    postMessage({ type: 'ready' });
});

onmessage = function(e) {
    if (!wasmModule) return;
    
    if (e.data.type === 'compute') {
        const { myId, boardStr, turn } = e.data;
        const move = wasmModule.ccall(
            'get_best_move', 
            'number', 
            ['number', 'string', 'number'], 
            [myId, boardStr, turn]
        );
        postMessage({ type: 'result', move: move });
    }
};
