
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, } from 'react-native';
import { Audio } from 'expo-av';

const image = {uri: "https://cdn3.geckoandfly.com/wp-content/uploads/2018/11/530-audio-recording.jpg" };

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");

  async function startRecording(){
    try{
      const permission = await Audio.requestPermissionsAsync();

      if(permission.status === "granted"){
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }else{
        setMessage("Please grant permission to app to access microphone");
      }
    }catch (err){
      console.error('Failed to  start recording', err);
    }
  }

  async function stopRecording(){
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updateRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updateRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    setRecordings(updateRecordings);
  }

  function getDurationFormatted(millis){
    const minutes = millis / 1000 / 60;
    const minuteDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minuteDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minuteDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines(){
    return recordings.map((recordingLine, index) => {
      return(
        <View key = {index} style = {styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play Recording"></Button>
        </View>
      );
    });
  }
  return (
    
      <View style={styles.container}>
          <Text style={styles.h1}>My Recording App</Text>
          <Text>{message}</Text>
          <Button 
            title={recording ? 'Stop Recording' : 'Start Recording'}
            onPress={recording ? stopRecording : startRecording}
            />
            {getRecordingLines()}
          <StatusBar style="auto" />
      </View>
  
    
  );
}

const radius = 20;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  h1:{
    fontSize:'1.2em',
    fontWeight:'bold',
    color:'rgb(33,150,243)',
    marginBottom:'40px',
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  fill:{
    flex: 1,
    margin: 16,
    backgroundColor:'rgb(33,150,243)',
    color:'white'
  },
  button:{
    margin: 16,
    borderRadius: radius,
  },
  img: {
    height: '100%',
  },
});
