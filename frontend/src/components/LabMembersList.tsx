import { useState, useEffect } from 'react';
import { Box, SimpleGrid, Image, Text, Heading, Divider } from '@chakra-ui/react';

const SERVER_IP: string = import.meta.env.VITE_PUBLIC_SERVER_IP;
const BACKEND_PORT: string = import.meta.env.VITE_BACKEND_PORT;
const BACKEND_URL: string = `http://${SERVER_IP}:${BACKEND_PORT}`;

const members = [
    { name: "Alice Johnson", photo: "https://via.placeholder.com/100", status: "Professor" },
    { name: "Bob Smith", photo: "https://via.placeholder.com/100", status: "D" },
    { name: "Charlie Brown", photo: "https://via.placeholder.com/100", status: "M2" },
    { name: "Diana White", photo: "https://via.placeholder.com/100", status: "M1" },
    { name: "Ethan Green", photo: "https://via.placeholder.com/100", status: "B4" }
];

type GroupedMembers = { [key: string]: typeof members };

const groupedMembers: GroupedMembers = members.reduce((acc: GroupedMembers, member) => {
    if (!acc[member.status]) {
        acc[member.status] = [];
    }
    acc[member.status].push(member);
    return acc;
}, {});

const LabMembersList = () => {
    return (
        <Box p={5}>
            {Object.entries(groupedMembers).map(([status, members]) => (
                <Box key={status} mb={6}>
                    <Heading size="lg" textAlign="left" ml="8">{status}</Heading>
                    <Divider my={2} />
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={2}>
                        {members.map((member, index) => (
                            <Box key={index} textAlign="center" borderWidth={1} borderRadius="md" borderStyle="hidden" p={3}>
                                <Image
                                    src="http://localhost:8000/static/photos/m1/rkimura_is_fighting.jpg"
                                    alt={member.name}
                                    boxSize="200px"
                                    mx="auto"
                                />
                                <Text mt={4} fontWeight="bold" fontSize="24">{member.name}</Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
            ))}
        </Box>
    );
};

export default LabMembersList;
