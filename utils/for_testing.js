const reverse = (string) => {
    return string
            .split("")
            .reverse()
            .join("");
};

const average = (array) => {
    const reducer = (sum, num) => {
        return sum + num;
    };
    const sum = array.reduce(reducer, 0);
    return array.length === 0
        ? 0
        : sum / array.length;
};


console.log(average([1,2,3,4,5]));

module.exports = {
    reverse,
    average
};