import * as d3 from 'd3';

class Utils {
    static getLinks = () => [
        { source: {id: `a0`, type: "a", reflexive: false}, target: {id: `a1`, type: "a", reflexive: false}, left: false, right: true },
        { source: {id: `a2`, type: "a", reflexive: false}, target: {id: `a3`, type: "a", reflexive: false}, left: false, right: true }
    ]

    static getNodes = () => [].concat(
        d3.range(10).map((i) => { return {id: `a${i}`, type: "a", reflexive: false}; }),
        d3.range(20).map((i) => { return {id: `b${i}`, type: "b", reflexive: true }; }),
        d3.range(30).map((i) => { return {id: `c${i}`, type: "c", reflexive: false}; }),
        d3.range(1).map((i) => { return  {id: `d${i}`, type: "d", reflexive: false}; })
    )
}

export default Utils;
