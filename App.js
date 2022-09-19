
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';


export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");

  async function startRecording(){
    try{
      const permission = await Audio.requestPermissionAsync();

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
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
        </View>
      );
    });
  }
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  fill:{
    flex: 1,
    margin: 16
  },
  button:{
    margin: 16
  }
});
