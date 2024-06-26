import React, { useState } from 'react';
import { Box, Heading, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton, useToast, VStack, HStack } from '@chakra-ui/react';
import { FaTrash, FaDownload, FaPlus, FaMinus } from 'react-icons/fa';
import Papa from 'papaparse';

const CSVUploader = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isCSVLoaded, setIsCSVLoaded] = useState(false);
  const toast = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setHeaders(result.data[0]);
        setData(result.data.slice(1));
        setIsCSVLoaded(true);
        toast({
          title: "File uploaded successfully.",
          description: `Parsed ${result.data.length - 1} rows.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      header: false,
    });
  };

  const handleCreateCSV = () => {
    setHeaders(['Column 1', 'Column 2', 'Column 3']);
    setData([['', '', '']]);
    setIsCSVLoaded(true);
  };

  const handleAddRow = () => {
    setData([...data, Array(headers.length).fill('')]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = data.map((row, i) => (i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row));
    setData(newData);
  };

  const handleAddColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newData = data.map(row => [...row, '']);
    setHeaders(newHeaders);
    setData(newData);
  };

  const handleRemoveColumn = () => {
    if (headers.length === 0) return;
    const newHeaders = headers.slice(0, -1);
    const newData = data.map(row => row.slice(0, -1));
    setHeaders(newHeaders);
    setData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse([headers, ...data]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box p={4} boxShadow="md" borderRadius="md" bg="white">
      <Heading as="h2" size="lg" mb={4}>CSV Upload and Edit Tool</Heading>
      {!isCSVLoaded ? (
        <VStack spacing={4}>
          <Button onClick={handleCreateCSV}>Create New CSV</Button>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
        </VStack>
      ) : (
        <>
          <HStack spacing={4} mb={4}>
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleAddColumn} leftIcon={<FaPlus />}>Add Column</Button>
            <Button onClick={handleRemoveColumn} leftIcon={<FaMinus />}>Remove Column</Button>
          </HStack>
          <Table variant="simple">
            <Thead>
              <Tr>
                {headers.map((header, index) => (
                  <Th key={index}>{header}</Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <Td key={colIndex}>
                      <Input value={cell} onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)} />
                    </Td>
                  ))}
                  <Td>
                    <IconButton aria-label="Remove row" icon={<FaTrash />} onClick={() => handleRemoveRow(rowIndex)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button onClick={handleDownload} mt={4} leftIcon={<FaDownload />}>Download CSV</Button>
        </>
      )}
    </Box>
  );
};

export default CSVUploader;