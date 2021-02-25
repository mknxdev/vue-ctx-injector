import DOM from '@/helpers/DOM.js'

describe('DOM helper', () => {
  const prefix = 'v:'
  const elementWithoutProps = document.createElement('div')
  const elementWithProps = document.createElement('div')
  elementWithProps.setAttribute('data-v:first-name', 'John')
  elementWithProps.setAttribute('data-v:last-name', 'Doe')
  elementWithProps.setAttribute('data-v:age', 18)

  it('should return well-parsed props from HTML customized element', () => {
    expect(DOM.getVCIElementProps(prefix, elementWithoutProps)).toEqual({})
    expect(DOM.getVCIElementProps(prefix, elementWithProps)).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      age: '18'
    })
    expect(DOM.getVCIElementProps(prefix, elementWithProps)).not.toEqual({
      firstName: 'John',
      lastName: 'Doe',
      age: 18
    })
  })
})
