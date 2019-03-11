import { Renderer, ResolveFn, render, renderFn } from './index'
import { expect } from 'chai'
import { describe } from 'mocha'

describe('Renderer', () => {
  it('is a constructor', () => {
    expect(new Renderer(['the string theory'], [])).to.be.an('object')
  })

  describe('.render()', () => {
    it('uses get() by default', () => {
      expect(render('Hello! My name is {{name}}!', { name: 'Alex' })).to.equal(
        'Hello! My name is Alex!'
      )
    })
  })

  describe('.renderFn()', () => {
    it('calls the custom resolve function', () => {
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFn = varName =>
        varName
          .split('')
          .reverse()
          .join('')

      expect(resolveFn('Alex')).to.equal('xelA')
      expect(
        renderFn('Hello! My name is {{name}}!', resolveFn, { name: 'Alex' })
      ).to.equal('Hello! My name is eman!')
    })

    it('passes the scope to the custom resolve function', () => {
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFn = (
        varName,
        obj: {
          [varName: string]: string
        }
      ) => obj[varName]

      const scope = { name: 'Alex' }
      expect(resolveFn('name', scope)).to.equal(scope.name)
      expect(
        renderFn('Hello! My name is {{name}}!', resolveFn, scope)
      ).to.equal('Hello! My name is Alex!')
    })
  })

  describe('.renderFnAsync()', () => {
    it('passes the scope to the custom resolve function', async () => {
      const resolver = new Renderer(['Hello! My name is ', '!'], ['name'])
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFn = async (
        varName,
        obj: {
          [varName: string]: string
        }
      ) => obj[varName]

      const scope = { name: 'Alex' }
      expect(await resolveFn('name', scope)).to.equal(scope.name)
      expect(await resolver.renderFnAsync(scope, resolveFn)).to.equal(
        'Hello! My name is Alex!'
      )
    })
  })
})
