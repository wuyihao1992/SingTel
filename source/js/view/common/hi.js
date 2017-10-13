!define(['conf'], function ($conf) {
    console.log($conf);
    document.title = 'Hi';
    // document.getElementById('app').innerHTML = 'Start Success! Welcome To hi.html!';

    return function ($html) {
        console.log($html);
        layer.msg('layer start success!');
    }
});
