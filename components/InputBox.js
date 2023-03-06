import React from "react";
import {
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "column",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginBottom: 5,
  },

  line155: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    padding: 10,
    color: "#17375e",
  },
});

export default function InputBox({
  inputWidth,
  inputStyle = {},
  inputWrapperStyle = {},
  inputLabelStyle = {},
  inputLabel,
  onChangeText,
  placeholder,
  inputValue,
  keyboardType = "default",
  editable = true,
  multiline = false,
  secureTextEntry = false,
  maxLength = Number.MAX_SAFE_INTEGER,
}) {
  applyWidth = inputWidth ? { width: inputWidth } : { alignSelf: "stretch" };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // behavior="position"
      // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.inputWrapper, inputWrapperStyle]}>
          <Text style={[styles.inputLabel, inputLabelStyle]}>{inputLabel}</Text>
          <TextInput
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            value={inputValue}
            editable={editable}
            multiline={multiline}
            maxLength={maxLength}
            placeholderTextColor="#707070"
            style={[
              styles.line155,
              inputStyle,
              applyWidth,
              editable == false && { backgroundColor: "#eff6ff" },
              multiline && { height: 80 },
            ]}
          ></TextInput>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
