import ErrorManager from '@/ErrorManager.js'

// functions mocking
console.error = jest.fn()

describe('ErrorManager', () => {
  const errorManager = new ErrorManager()
  const errMessagePrefix = '[VueCtxInjector]'
  const errMessage = 'This is an error message.'
  const successMessage = 'All is gonna be fine!'

  it('should throw an arror containing a message', () => {
    expect(() => {
      errorManager.throwError(errMessage)
    }).toThrow(Error)
  })
  it('should log the given message as an arror', () => {
    errorManager.logError(errMessage)
    expect(console.error.mock.calls[0][0]).toBe(`${errMessagePrefix} ${errMessage}`)
  })
  it('should return false or the callback return value depending on thrown error status', () => {
    expect(errorManager.encapsulate(() => {
      throw new Error('An Error exception was thrown!')
    })).toBe(false)
    expect(errorManager.encapsulate(() => {
      return successMessage
    })).toBe(successMessage)
  })
  // it('should encapsulate a given function for error catching', () => {
    
  // })
})
