// import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import { useState, useEffect } from 'react'
import axios from 'axios'

export function PokemonDetails() {
    const [numPokemon, definir_numPokemon] = useState('') // armazena o número digitado pelo usuário
    const [nomePokemon, definir_nomePokemon] = useState('') // armazena o nome do Pokémon
    const [tipoPokemon, definir_tipoPokemon] = useState<string[]>([]) // armazena os tipos do Pokémon
    const [imgPokemon, definir_imgPokemon] = useState('') // armazena a URL do sprite do Pokémon
    const [loading, definir_Loading] = useState(false) // controlar o carregamento dos dados

    const buscaPokemonDetails = async () => {
        try {
            definir_Loading(true) // início do carregamento
            const resposta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numPokemon}/`) // requisitando os detalhes do Pokemon à API
            const nome = resposta.data.name // pegando o nome do Pokémon
            const tipos = resposta.data.types.map((type: any) => type.type.name) // pegando os tipos do Pokémon
            const spriteUrl = resposta.data.sprites.other.dream_world.front_default // pegando a URL da imagem do Pokémon

            definir_nomePokemon(nome) // atualizando o estado com o nome do Pokémon
            definir_tipoPokemon(tipos) // atualizando o estado com o tipo do Pokémon
            definir_imgPokemon(spriteUrl) // atualizando o estado com da imagem do Pokémon
        } catch (error) {
            console.log('Ocorreu um erro ao buscar detalhes do Pokémon:', error) // tratamento de erro da requisição
        } finally {
            definir_Loading(false); // Finalizando o carregamento
        }
    }

    useEffect(() => {
        buscaPokemonDetails()
    }, [numPokemon])

    const atualizar = () => {
        buscaPokemonDetails();
    }

    return (
        <>
        <div className="top-image">
          <img id="logopokemon" src="https://imgur.com/qwW3iia.png"></img>
        </div>
        <div className="pokemon-card">
            <div>
                <h3 className="titulo">
                    Digite o número do Pokémon:
                    <input type="number" value={numPokemon} onChange={(e) => definir_numPokemon(e.target.value)} min="1" />
                </h3>
            </div>

            <div className="loading-spinner">
                <ClipLoader color="#007bff" loading={loading}/>
            </div>

            {loading ? (
                <h3 id='loading'>Loading...</h3>
            ) : (
                nomePokemon && (
                    <div>
                        <h3 className='nomePokemon'>{nomePokemon.charAt(0).toUpperCase() + nomePokemon.slice(1)}</h3>
                        <div className="pokemon-image">
                            <div className="circle"></div>
                            {imgPokemon && <img src={imgPokemon} alt={nomePokemon} className="pokemon" id="imagem" />}
                            <p></p>
                        </div>
                        <p className="pokemon-types">{tipoPokemon.map((tipo) => tipo.charAt(0).toUpperCase() + tipo.slice(1)).join(', ')}</p>
                    </div>
                )
            )}
            <button onClick={atualizar} id='att'>Atualizar</button>
        </div>
        </>
    )
}