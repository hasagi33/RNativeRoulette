import { StatusBar } from 'expo-status-bar';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing, interpolate,
} from 'react-native-reanimated';
import {useState} from "react";

const ANIMATION_DURATION = 3500

export default function App() {
  const [chipAmount, setChipAmount] = useState(10)
  const [betAmount, setBetAmount] = useState(0)
  const [wheelIsSpinning, setWheelIsSpinning] = useState(false)
  const rotationAmount = useSharedValue(0)

  const animatedRotationStyle = useAnimatedStyle(() => {
    return{
      transform: [
        {
          rotate: `${rotationAmount.value}deg`,
        },
      ],
    }
  })

  const increaseBetAmount = () => {
    setBetAmount(prev => {
      if(prev>=chipAmount){
        return prev
      }
      return prev+1
    })
  }
  const lowerBetAmount = () => {
    setBetAmount(prev => {
      if(prev>0){
        return prev-1
      }else{
        return prev
      }
    })
  }
  const disableButtons = () => {
    setWheelIsSpinning(true)
    setTimeout(() => {
      setWheelIsSpinning(false)
    }, ANIMATION_DURATION)
  }

  const rotateWheelForAmount = (amount) => {
    rotationAmount.value = withTiming(rotationAmount.value + 1440 + amount * 24, {
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.28, 0.04, 0.37, 1),
    })
  }
  const randomNumberFrom1To14 = () => {
    return Math.floor(Math.random()*15)
  }
  const calculateWinnings = (color) => {
    setTimeout(() => {
      setBetAmount(0)
      let place = (((Math.floor(rotationAmount.value+0.99)%360)/24)+10)%15
      if(color==="GREEN" && place===0){
        setChipAmount(prevState => (prevState+betAmount*13))
      }else{
        if(color==="BLACK" && place%2===0){
          setChipAmount(prevState => (prevState+betAmount))
        }else{
          if(color==="RED" && place%2!==0){
            setChipAmount(prevState => (prevState+betAmount))
          }else{
            setChipAmount(prevState => (prevState-betAmount))
          }
        }
      }
    }, ANIMATION_DURATION+30)
  }

  const spinBettingOnRed = () => {
    disableButtons()
    rotateWheelForAmount(randomNumberFrom1To14())
    calculateWinnings("RED")
  }
  const spinBettingOnBlack = () => {
    disableButtons()
    rotateWheelForAmount(randomNumberFrom1To14())
    calculateWinnings("BLACK")

  }
  const spinBettingOnGreen = () => {
    disableButtons()
    rotateWheelForAmount(randomNumberFrom1To14())
    calculateWinnings("GREEN")
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>{"▼"}</Text>
      <Animated.View style={animatedRotationStyle}>
        <Image style={styles.imageStyle} source={require("./assets/roulete.png")}  />
      </Animated.View>

      <View style={{gap: 15, alignItems: "center"}}>
        <Text>{`Chip amount: ${chipAmount}`}</Text>
        <View style={{alignItems: "center"}}>
          <Text>{`Bet amount: ${betAmount}`}</Text>
          <View style={{flexDirection: "row", gap: 10}}>
            <TouchableOpacity onPress={lowerBetAmount} style={styles.changeBetAmountButton}>
              <Text>{"-"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={increaseBetAmount} style={styles.changeBetAmountButton}>
              <Text>{"+"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: "row", gap: 5}}>
          <TouchableOpacity onPress={spinBettingOnRed} disabled={wheelIsSpinning} style={[styles.betButton, {backgroundColor: "red"}]}>
            <Text style={{color: "white"}}>{"2X"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={spinBettingOnBlack} disabled={wheelIsSpinning} style={[styles.betButton, {backgroundColor: "black"}]}>
            <Text style={{color: "white"}}>{"2X"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={spinBettingOnGreen} disabled={wheelIsSpinning} style={[styles.betButton, {backgroundColor: "green"}]}>
            <Text style={{color: "white"}}>{"14X"}</Text>
          </TouchableOpacity>
        </View>
      </View>




    </View>
  );
}

const styles = StyleSheet.create({
  changeBetAmountButton:{
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d9d9d9",
    width: 35,
    height: 50,
    borderRadius: 10,
  },
  betButton:{
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  imageStyle:{
    width: 300,
    height: 300,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
