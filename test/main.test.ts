import 'mocha'
import { expect } from 'chai'
import { spy } from 'sinon'

/**
 * 测试函数
 * 接受一个函数，并在返回函数每次调用时给其传入一个闭包的累加值
 */
const testFunc = function (callback: (num: number) => any): () => void {
    let localValue = 0;
    return () => callback(localValue ++)
}

describe('testFunc 测试', function () {
    it('可以正常累加', function () {
        const mockCallback = spy();

        const work = testFunc(mockCallback);
        work();
        work();
        work();

        expect(mockCallback.callCount).to.be.equal(3);
        expect(mockCallback.args).to.be.deep.equal([[0], [1], [2]]);
    })
})