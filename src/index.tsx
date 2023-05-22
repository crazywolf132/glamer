import React, { useMemo, ComponentType } from 'react';
import {
    ActivityIndicator, Button, DatePickerIOS, DrawerLayoutAndroid, FlatList, Image,
    ImageBackground, KeyboardAvoidingView, Modal, Pressable, ProgressBarAndroid,
    RefreshControl, SafeAreaView, ScrollView, SectionList, Slider,
    Switch, Text, TextInput, TouchableHighlight, TouchableOpacity, View, VirtualizedList,
    ViewStyle, TextStyle, ImageStyle, StyleProp
} from 'react-native';
import useWidth from './useWidth';
import type { ComponentPropsWithoutRef } from 'react';

// Define components map
const components = {
    ActivityIndicator,
    Button,
    DatePickerIOS,
    DrawerLayoutAndroid,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    ProgressBarAndroid,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    SectionList,
    Slider,
    Switch,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
    VirtualizedList,
} as const;

type ComponentKeys = keyof typeof components;

type Style = ViewStyle & TextStyle & ImageStyle;

// Interface for each theme part
interface ThemePart {
    base?: Style;
    focused?: Style;
    pressed?: Style;
}

// Interface for the whole theme
type ThemeDefinition<T extends ComponentKeys> = {
    [key: string]: ThemePart & {
        _: T;
    };
}

type ComponentPropsMap = {
    [K in ComponentKeys]: ComponentPropsWithoutRef<typeof components[K]> & { focused?: boolean, pressed?: boolean, style?: StyleProp<Style>, width?: 1 | 2 | 3 | 4, usingLayout?: boolean };
};

type Result<T extends ComponentKeys> = {
    [K in keyof ThemeDefinition<T>]: React.FC<ComponentPropsMap[ThemeDefinition<T>[K]['_']]>;
};

// The main function
const Style = <T extends ComponentKeys, TD extends ThemeDefinition<T>>(theme: TD): Result<T> => {
    const output: any = {};

    // Loop through each theme
    for (const key in theme) {
        const {
            _,
            base = {},
            focused = {},
            pressed = {},
        } = theme[key];

        const Component: ComponentType<any> = components[_];

        // Create a new component
        output[key] = (props: ComponentPropsMap[typeof _]) => {

            // Combine styles, only recomputed when necessary
            const finalStyle = useMemo(() => {
                let style = { ...base };
                if (props.focused && focused) {
                    style = { ...style, ...focused };
                }
                if (props.pressed && pressed) {
                    style = { ...style, ...pressed };
                }
                if (props.style) {
                    style = { ...style, ...props.style as any }
                }
                if (props.usingLayout) {
                    style = { ...style, ...useWidth(props) }
                }
                return style;
            }, [props.focused, props.pressed, props.style]);

            // Pass all initial props and override with the calculated style
            const allProps = { ...props, style: props.style ? [props.style, finalStyle] as StyleProp<Style> : finalStyle };

            return <Component {...allProps} />;
        };

    }
    return output as Result<T>;
};


export { Style };