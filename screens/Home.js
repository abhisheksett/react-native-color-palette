import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PalettePreview from '../components/PalettePreview';

const Home = ({ navigation, route }) => {
  const [colorPalettes, setColorPalettes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { newColorPalette } = route.params || {};

  const fetchColorPalettes = useCallback(async () => {
    const results = await fetch(
      'https://color-palette-api.kadikraman.now.sh/palettes',
    );
    if (results.ok) {
      const palettes = await results.json();
      setColorPalettes(palettes);
    }
  }, []);

  useEffect(() => {
    if (newColorPalette) {
      setColorPalettes([newColorPalette, ...colorPalettes]);
    }
  }, [newColorPalette]);

  useEffect(() => {
    fetchColorPalettes();
  }, []);

  const onPress = (item) => {
    navigation.navigate('ColorPalette', item);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchColorPalettes();
    setRefreshing(false);
  };

  return (
    <FlatList
      style={styles.list}
      data={colorPalettes}
      keyExtractor={(item) => item.paletteName}
      renderItem={({ item }) => (
        <PalettePreview handlePress={onPress} palette={item} />
      )}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListHeaderComponent={
        <TouchableOpacity
          onPress={() => navigation.navigate('ColorPaletteModal')}>
          <Text style={styles.buttonText}>Add a color scheme</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'teal',
    marginBottom: 10,
  },
});

export default Home;
