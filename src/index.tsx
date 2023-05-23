import React, { useMemo, ComponentType, ForwardedRef } from 'react';
import {
    ActivityIndicator, Button, DrawerLayoutAndroid, FlatList, Image,
    ImageBackground, KeyboardAvoidingView, Modal, Pressable,
    RefreshControl, SafeAreaView, ScrollView, SectionList, Slider,
    Switch, Text, TextInput, TouchableHighlight, TouchableOpacity, View, VirtualizedList,
    ViewStyle, TextStyle, ImageStyle, StyleProp
} from 'react-native';
import useWidth from './useWidth';
import type { ComponentPropsWithoutRef } from 'react';

const components = {
    ActivityIndicator,
    Button,
    DrawerLayoutAndroid,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Pressable,
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

interface ThemePart {
    [key: string]: Style | undefined;
    variants?: { [key: string]: Style };
}

interface ThemeDefinition {
    [K: string]: {
        _: ComponentKeys | ComponentType<any>;
    } & ThemePart;
}

type BaseProps<T> = T extends ComponentKeys
    ? ComponentPropsWithoutRef<typeof components[T]>
    : T extends ComponentType<infer P> ? P : never;

type ConditionalProps<T extends keyof any> = {
    [P in T as `is${Capitalize<string & P>}`]?: boolean;
} & {
    variant?: keyof ThemePart['variants'];
    style?: StyleProp<Style>;
    width?: 1 | 2 | 3 | 4;
    usingLayout?: boolean;
};

type ComponentPropsMap<T> = BaseProps<T> & ConditionalProps<Exclude<keyof ThemePart, 'variants'>>;

type Result = {
    [K in keyof ThemeDefinition]: React.FC<ComponentPropsMap<ThemeDefinition[K]['_']> & { ref?: ForwardedRef<any> }>;
};

const Style = (theme: ThemeDefinition): Result => {
    const output: any = {};

    for (const key in theme) {
        const componentStyles = theme[key];
        const Component: ComponentType<any> = typeof componentStyles._ === 'string' ? components[componentStyles._ as keyof typeof components] : componentStyles._;

        output[key] = React.forwardRef((props: ComponentPropsMap<typeof componentStyles._>, ref: ForwardedRef<any>) => {
            const finalStyle = useMemo(() => {
                let style = { ...componentStyles.base as Style };

                for (const styleKey in componentStyles) {
                    if (styleKey !== '_' && styleKey !== 'base' && styleKey !== 'variants' && props[`is${styleKey.charAt(0).toUpperCase() + styleKey.slice(1)}`]) {
                        style = { ...style, ...(componentStyles[styleKey] as Style) };
                    }
                }

                if (props.variant && componentStyles.variants && componentStyles.variants[props.variant]) {
                    style = { ...style, ...(componentStyles.variants[props.variant] as Style) };
                }

                if (props.style) {
                    style = { ...style, ...props.style as any };
                }
                if (props.usingLayout) {
                    style = { ...style, ...useWidth(props) };
                }
                return style;
            }, [props, componentStyles]);

            const allProps = { ...props, style: props.style ? [props.style, finalStyle] as StyleProp<Style> : finalStyle };

            return <Component ref={ref} {...allProps} />;
        });
    }
    return output as Result;
};

export { Style };
