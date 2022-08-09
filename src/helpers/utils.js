import _ from 'lodash';

class Utils {
    static getDimensions(nodes, windowWidth = true) {
        const arrX = [];
        const arrY = [];
        nodes.forEach((n) => {
            arrX.push(n.x);
            arrY.push(n.y);
        });

        const min = [_.min(arrX), _.min(arrY)];
        const max = [_.max(arrX), _.max(arrY)];

        let width = max[0] - min[0];
        let height = max[1] - min[1];

        if (windowWidth) {
            width = _.max([min[0] + max[0], window.innerWidth]);
            height = _.max([min[1] + max[1], window.innerHeight]);
        }
        return {
            min,
            max,
            width: Math.abs(width),
            height: Math.abs(height),
        };
    }

}

export default Utils;
