const fontSize = require('./app.js')
console.log('fontSize: ', fontSize);
export const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
  fontSize: {
    fontSize: fontSize
  },
  textRed: {
    color: 'rgba(255, 0, 0, 1.0)'
  },
  backgroundRed: {
    backgroundColor: 'rgba(255, 0, 0, 1.0)'
  },
  textOrange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  backgroundOrange: {
    backgroundColor: 'rgba(255, 127, 0, 1.0)',
  },
  textYellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  backgroundYellow: {
    backgroundColor: 'rgba(180, 180, 0, 1.0)',
  },
  textGreen: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  backgroundGreen: {
    backgroundColor: 'rgba(0, 180, 0, 1.0)',
  },
  textBlue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  backgroundBlue: {
    backgroundColor: 'rgba(0, 0, 255, 1.0)',
  },
  textIndigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  backgroundIndigo: {
    backgroundColor: 'rgba(75, 0, 130, 1.0)',
  },
  textViolet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
  backgroundViolet: {
    backgroundColor: 'rgba(127, 0, 255, 1.0)',
  }
};
