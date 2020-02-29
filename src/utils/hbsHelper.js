const hbs = require('express-hbs');

module.exports = () => {
    hbs.registerHelper('math', function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        } [operator];
    });

    hbs.registerHelper('eachCustom', function (context, sortType, options) {
        const contextSorted = context.concat().sort((tag1, tag2) => {
            if (sortType === 'totalViews') return tag2.totalViews - tag1.totalViews;
            else if (sortType === 'occurences') return tag2.occurences - tag1.occurences;
        });
        let output = '';
        for (let i = 0, j = contextSorted.length; i < j; i++) {
            contextSorted[i].index = i;
            output += options.fn(contextSorted[i]);
        }

        return output;
    });

    hbs.registerHelper('formatNumber', function (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    });
}