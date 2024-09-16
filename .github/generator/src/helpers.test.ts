import { createTemplateLibrary, Library } from "./helpers";

describe('createTemplateLibrary', () => {
  let templateLibrary: string
  let parsedLibrary: Library
  let library: Library['library']

  beforeAll(async () => {
    templateLibrary = await createTemplateLibrary()
    parsedLibrary = JSON.parse(templateLibrary)
    library = parsedLibrary.library
  })

  it('should create the library', () => {
    expect(parsedLibrary).toHaveProperty('baseUrl')

    expect(library).toHaveProperty('Financial Services')
    expect(library).toHaveProperty('Healthcare')
    expect(library).toHaveProperty('Human Resources')
    expect(library).toHaveProperty('Identification')
    expect(library).toHaveProperty('Insurance')
    expect(library).toHaveProperty('Logistics')
    expect(library).toHaveProperty('Real Estate')
    expect(library).toHaveProperty('Tax Forms')
  })
})

