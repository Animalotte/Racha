interface CEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

export async function fetchAddressByCEP(cep: string): Promise<CEPResponse | null> {
  try {
    const cleanCEP = cep.replace(/\D/g, '')
    
    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos')
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
    
    if (!response.ok) {
      throw new Error('Erro na requisição')
    }
    
    const data: CEPResponse = await response.json()
    
    if (data.erro) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}