import { Box, useToast, FlatList } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
    poolId: string;
    code: string;
}

export function Guesses({ poolId, code }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [games, setGames] = useState<GameProps[]>([]);
    const [firstTeamPoints, setFirstTeamPoints] = useState('');
    const [secondTeamPoints, setSecondTeamPoints] = useState('');

    const toast = useToast();

    async function fetchGames() {
        try {
            setIsLoading(true);

            const response = await api.get(`/polls/${poolId}/games`);
            setGames(response.data.games);

        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Não foi possível recuperar os jogos',
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally {
            setIsLoading(false);
        }
    }

    async function handleGuessConfirm(gameId: string) {
        try {
            if(!firstTeamPoints.trim() || !firstTeamPoints.trim()) {
                toast.show({
                    title: 'Informe o placar do palpite',
                    placement: 'top',
                    bgColor: 'red.500'
                }); 
                return;
            }

            await api.post(`/polls/${poolId}/games/${gameId}/guesses`, {
                firstTeamPoints: Number(firstTeamPoints),
                secondTeamPoints: Number(secondTeamPoints)
            });

            toast.show({
                title: 'Palpite realizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            }); 

            fetchGames();
        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Não foi possível enviar o palpite',
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: poolId
        });
    }
 
    useEffect(() => {
        fetchGames();
    }, [poolId]);

    if(isLoading) {
        return(
            <Loading />
        );
    }

    return (
        <FlatList
            data={games}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Game
                    data={item}
                    setFirstTeamPoints={setFirstTeamPoints}
                    setSecondTeamPoints={setSecondTeamPoints}
                    onGuessConfirm={() => handleGuessConfirm(item.id)}
                />
            )}
            ListEmptyComponent={() =>  <EmptyMyPoolList code={code} handleCodeShare={handleCodeShare} />}
        />
    ); 
}