/**
 * events 模块只提供了一个对象： events.EventEmitter。
 * EventEmitter 的核心就是事件触发与事件监听器功能的封装。
 * EventEmitter 提供了多个属性，常用如 on 和 emit。
 * on 函数用于绑定事件函数，emit 属性用于触发一个事件。
 */
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 
event.on('some_event', function() { 
    console.log('some_event 事件触发'); 
}); 
setTimeout(function() { 
    event.emit('some_event'); 
}, 1000); 