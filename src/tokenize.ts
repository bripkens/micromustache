import { isString, assertSyntax, assertType } from './util'

export interface ITokens {
  strings: string[]
  varNames: string[]
}

/**
 * Parse a string and returns an array of variable names and non-processing strings.
 * functions ready for the compiler to go through them.
 * This function could use regular expressions but using simpler searches is faster.
 *
 * @param template - the template
 * @param options - you can provide a custom open and close symbol.
 * Note that for the sake of explicity if you pass an option param, it should be an object containing both open and close symbols.
 * @returns - the resulting tokens as an object that has strings and variable names
 */
export function tokenize(
  template: string,
  openSym = '{{',
  closeSym = '}}'
): ITokens {
  assertType(
    isString(openSym),
    'The openSym parameter must be a string. Got',
    openSym
  )
  assertType(
    isString(closeSym),
    'The closeSym parameter must be a string. Got',
    closeSym
  )

  const openSymLen = openSym.length
  const closeSymLen = closeSym.length

  let openIndex: number
  let closeIndex: number = 0
  let before: string
  let varName: string
  const strings: string[] = []
  const varNames: string[] = []

  for (
    let currentIndex = 0;
    currentIndex < template.length;
    currentIndex = closeIndex
  ) {
    openIndex = template.indexOf(openSym, currentIndex)
    if (openIndex === -1) {
      break
    }

    closeIndex = template.indexOf(closeSym, openIndex)
    assertSyntax(
      closeIndex !== -1,
      'Missing',
      closeSym,
      'in template expression',
      template
    )

    varName = template.substring(openIndex + openSymLen, closeIndex).trim()

    assertSyntax(
      !varName.includes(openSym),
      'Missing',
      closeSym,
      'in template expression',
      template
    )

    assertSyntax(varName.length, 'Unexpected token', closeSym)
    varNames.push(varName)

    closeIndex += closeSymLen
    before = template.substring(currentIndex, openIndex)
    strings.push(before)
  }

  const rest = template.substring(closeIndex)
  strings.push(rest)

  return { strings, varNames }
}
