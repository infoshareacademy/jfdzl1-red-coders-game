
const person = {
    nationality: 'Polish',
    greet: function (n) {
        console.log('Hi, Im ' + n);
    }
};
const me = Object.create(person);
me.name = 'maciek';
me.surname = 'ziemba';
me.age = 32;


//console.log(me.greet(me.name));

Object.getPrototypeOf(me).nationality = 'German';
const x = me.nationality;
console.log(x);
