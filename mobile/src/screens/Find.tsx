import { useNavigation } from "@react-navigation/native";
import { Heading, VStack, Text, useToast } from "native-base";
import { useState } from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');

    const { navigate } = useNavigation();
    const toast = useToast();

    async function handleJoinPoll() {
        try {
            setIsLoading(true);

            if(!code.trim()) {
                toast.show({
                    title: 'Informe o código',
                    placement: 'top',
                    bgColor: 'red.500'
                });
                return;
            }

            await api.post('polls/join', { code });   
            
            toast.show({
                title: 'Você entrou no bolão com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });

            navigate('polls');

        } catch (error) {
            console.log(error);
            if(error.response?.data?.message == 'Poll not found.') {
                toast.show({
                    title: 'Bolão não encontrado!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
                return;
            }

            if(error.response?.data?.message == 'You already joined this poll.') {
                toast.show({
                    title: 'Você já participa deste bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                });
                return;
            }

            toast.show({
                title: 'Não foi possível encontrar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsLoading(false);
        }
    }
 
    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre um bolão através de {'\n'} 
                    seu código único
                </Heading>

                <Input  
                    mb={2} 
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />

                <Button 
                    title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    onPress={handleJoinPoll}
                />
            </VStack>
        </VStack>
    )
}