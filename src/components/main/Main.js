import React from 'react';
import { Div, File, FormLayout, Button, Placeholder, Group, Cell, Avatar, Spinner } from "@vkontakte/vkui";
import Icon24Document from '@vkontakte/icons/dist/24/document';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import axios, { post } from 'axios';

const getAge = (age) => {
    return age && age !== 'undefined' ? 'Возраст: ' + age : 'Возраст не указан';
};

const getCity = (city) => {
    return city && city != 'undefined' ? city : 'Город не указан';
};

const getProfile = (id) => {
    return `https://vk.com/id${id}`;
};

const Actions = ({ city, id }) => {
    return (
        <Button size="l" stretched style={{ marginRight: 5 }} level="secondary" component="a" href={ getProfile(id) }> Профиль </Button>
    );
};

const UserItem = ({ firstname, age, city, image, thumbnail, id }) => {
    return (
        <Cell photo={ thumbnail }
              description={ getAge(age) + ', ' + getCity(city) }
              bottomContent={ <Actions city={ city } id={ id }/> }
              before={<Avatar src={ image } size={80}/> }
              size="l"
        >
            { firstname }
        </Cell>
    );
};

export default class extends React.Component {
    state ={
        imageFile: null,
        imageUlr: null,
        isLoadImage: false,
        response: null,
        isProcessed: false,
    };

    onFormSubmit = async (e) => {
        e.preventDefault();

        this.setState({
            isProcessed: true
        });

        let response = await this.fileUpload(this.state.imageFile);

        await this.setState({
            response: response.data.res,
            isProcessed: false
        });
    };

    onChange = (e) => {
        this.setState({
            imageFile: e.target.files[0],
            isLoadImage: e.target.files[0] != 'undefined'
        });
    };

    fileUpload = (file) => {
        const url = 'http://c95202tj.bget.ru/site/upload2';
        const formData = new FormData();
        formData.append('imageFile', file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        return post(url, formData, config)
    };

    render() {

        let place =
                <Placeholder
                    icon={<Icon56UsersOutline  />}
                >
                    Загрузите изображение для поиска
                </Placeholder>;

        if (this.state.isLoadImage === true) {
            place =
                <Div>
                    <img style={{maxWidth: '100%', maxHeight: '100%'}} src={ URL.createObjectURL(this.state.imageFile) } alt="alt"/>
                </Div>
        }

        let resultContent = this.state.isProcessed == false
            ? 'Здесь будут отображаться люди, которых вы возможно ищите'
            :
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Spinner size="large" style={{ marginTop: 20 }} />
            </div>;

        let results =
            <Placeholder
                title="Находите друзей"
            >
                { resultContent }
            </Placeholder>;

        if (this.state.response != null) {
            results = this.state.response.data.map((i, c) => {
                return (
                    <UserItem key={ c }
                              firstname={ i.firstname }
                              image={ i.details[1].url }
                              thumbnail={ i.thumbnail }
                              age={ i.age }
                              city={ i.city }
                              id={ i.userid }
                    />
                )
            })
        }

        return (
            <>
                { place }

                <FormLayout onSubmit={ this.onFormSubmit }>
                    <File onChange={ this.onChange }
                          top="Загрузите фотографию"
                          before={<Icon24Document />}
                          size="xl" level="secondary"
                    />
                    <Button size="xl">Пожалуйста найдись!</Button>
                </FormLayout>

                <Group title="Результаты">
                    { results }
                </Group>
            </>
        );
    }
}