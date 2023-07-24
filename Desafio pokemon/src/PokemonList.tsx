import { useState, useEffect } from 'react'
import axios from 'axios'

export function PokemonList() {
    const [listaPokemon, definir_PokemonList] = useState<any[]>([])
    const [pagAtual, definir_pagAtual] = useState(1)
    const [loading, definir_Loading] = useState(false)

    let isFetching = false // Variável para controlar se já está buscando novos Pokémon

    const buscarPokemon = async () => {
        try {
            definir_Loading(true)
            isFetching = true // Marca como buscando

            const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(pagAtual - 1) * 20}`)
            const pokemons = resp.data.results

            const promises = pokemons.map(async (pokemon: any) => {
                const resp = await axios.get(pokemon.url)
                return {
                    name: pokemon.name,
                    number: resp.data.id,
                    image: resp.data.sprites.other['official-artwork'].front_default,
                }
            })

            const pokemonDetails = await Promise.all(promises)

            if (pagAtual === 1) { // Se estivermos na página 1, definimos a lista com os Pokémon iniciais
                definir_PokemonList(pokemonDetails)
            } else { // adicionar os Pokémon na lista existente
                definir_PokemonList((prevList) => [...prevList, ...pokemonDetails])
            }

            definir_pagAtual((prevPage) => prevPage + 1) // Atualiza a página atual para a próxima página
        } catch (error) {
            console.error('Ocorreu um erro ao buscar mais Pokémon:', error)
        } finally {
            isFetching = false
            definir_Loading(false)
        }
    }

    useEffect(() => {
        buscarPokemon()
    }, [pagAtual])

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY
            const documentHeight = document.body.offsetHeight

            if (scrollPosition >= documentHeight && !loading) { // Verifica se o scroll está no final da página e se não está carregando
                setTimeout(buscarPokemon, 500)
            }
        }
 
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [pagAtual, loading]) // Reage ao carregamento infinito quando a página atual muda ou o loading muda

    return (
        <div className="container">
            <div className="lista">
                <h2 id='tituloList'>Lista de Pokémon</h2>
                <ul>
                    {listaPokemon.map((pokemon) => (
                        <li key={pokemon.name}>
                            <img src={pokemon.image} alt={pokemon.name} id='imgdd' />
                            <p className="number">{pokemon.number}</p>
                            <p className="name">{pokemon.name}</p>
                        </li>
                    ))}
                </ul>
                {loading && <p>Carregando mais Pokémons...</p>}
            </div>
        </div>
    )
}
