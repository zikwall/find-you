import 'core-js/es/map';
import 'core-js/es/set';

import React, { useState } from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import connect from "@vkontakte/vk-connect";
import { Root, View, Panel, PanelHeader, Footer } from "@vkontakte/vkui";
import { Main } from "./components/main";
import { Heart } from './components/icons';

connect.send("VKWebAppInit", {});

const App = () => {
    const [activeView, setActiveView] = useState('view1');

    return (
        <Root activeView={ activeView }>
            <View activePanel="panel1.1" id="view1">
                <Panel id="panel1.1">
                    <PanelHeader>Ищу тебя <Heart /></PanelHeader>
                    <Main/>

                    <Footer> status:@dev-v1.1.3 </Footer>
                </Panel>
            </View>
        </Root>
    );
};

export default App;
