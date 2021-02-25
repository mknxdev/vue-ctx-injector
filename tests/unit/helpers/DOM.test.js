import DOM from '@/helpers/DOM.js'

describe('DOM helper', () => {
  const prefix = 'v:'
  const element = document.createElement('div')
  element.setAttribute('data-v:first-name', 'John')
  element.setAttribute('data-v:last-name', 'Doe')
  element.setAttribute('data-v:age', 18)

  it('should return well-parsed props from HTML customized element', () => {
    expect(DOM.getVCIElementProps(prefix, element)).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      age: '18'
    })
  })
})
