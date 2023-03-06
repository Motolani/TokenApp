import React from "react";

import {
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);


const styles = StyleSheet.create({
  Button: {
    borderRadius: 10,
    backgroundColor: "#01cf13",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 50,
    padding: 10,
  },

  ButtonText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    color: "#ffffff",
    textAlign:'center'
  },
});

export default function GreenButton({
  disabled = false,
  onPress,
  text,
  textStyle = {},
  processing= false,
  buttonWidth
})


{

  applyWidth =  buttonWidth ?  {width:buttonWidth} : {alignSelf:'stretch'};

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.Button, applyWidth ]}
    >
      {processing ? (
        <Text style={styles.ButtonText}>
          Processing <ActivityIndicator size="small" color="#ffffff" />
        </Text>
      ) : (
        <Text style={[styles.ButtonText, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
