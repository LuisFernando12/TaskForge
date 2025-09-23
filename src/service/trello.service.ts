import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
export interface IResponseCreateBoard {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
}
@Injectable()
export class TrelloService {
  private readonly baseURlApiTrello: string;
  constructor(private readonly configService: ConfigService) {
    this.baseURlApiTrello = this.configService.get('BASE_URL_API_TRELLO');
  }
  async createBoard(
    nameProject: string,
    token: string,
    apiKey: string,
    defaultLists?: boolean,
  ): Promise<IResponseCreateBoard> {
    try {
      const { data } = await axios.post(
        `${this.baseURlApiTrello}/boards/?name=${nameProject}&key=${apiKey}&token=${token}&defaultLists=${defaultLists || false}`,
      );
      const { id, name, url, shortUrl } = data;
      return { id, name, url, shortUrl };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async createLabelOnBoard(
    idBoard: string,
    name: string,
    color: string,
    apiKey: string,
    token: string,
  ) {
    try {
      const { data, status } = await axios.post(
        `${this.baseURlApiTrello}/boards/${idBoard}/labels?name=${name}&color=${color}&key=${apiKey}&token=${token}`,
      );
      if (status !== 200) {
        throw new InternalServerErrorException('Error to create Label');
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ? error.message : error,
      );
    }
  }
  async createListOnBoard(
    name: string,
    idBoard: string,
    apiKey: string,
    token: string,
    pos?: number | string,
  ) {
    try {
      const backloag = await axios.post(
        `${this.baseURlApiTrello}/lists?name=${name}&idBoard=${idBoard}${pos ? '&pos=' + pos : ''}&key=${apiKey}&token=${token}`,
      );
      return backloag.data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async createCardOnList(
    name: string,
    idList: string,
    description: string,
    apiKey: string,
    token: string,
  ) {
    try {
      const params = new URLSearchParams({
        name,
        idList,
        desc: description,
        key: apiKey,
        token,
      });
      const response = await axios.post(
        `${this.baseURlApiTrello}/cards`,
        params,
      );
      if (response.status !== 200) {
        throw new InternalServerErrorException('Error to created card');
      }
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async addLabelOnCard(
    idCard: string,
    idLabel: string,
    apiKey: string,
    token: string,
  ) {
    try {
      const { data, status } = await axios.post(
        `${this.baseURlApiTrello}/cards/${idCard}/idLabels?value=${idLabel}&key=${apiKey}&token=${token}`,
      );
      if (status !== 200) {
        throw new InternalServerErrorException('Error to added label on card!');
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ? error.message : error,
      );
    }
  }
  async createCheckilistOncard(
    idCard: string,
    name: string,
    apikey: string,
    token: string,
  ) {
    try {
      const { data, status } = await axios.post(
        `${this.baseURlApiTrello}/checklists?idCard=${idCard}&name=${name}&key=${apikey}&token=${token}`,
      );
      if (status !== 200) {
        throw new InternalServerErrorException('Error to create checklist');
      }
      return data.id;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ? error.message : error,
      );
    }
  }
  async createCheckitemOnChecklist(
    idChecklist: string,
    name: string,
    apikey: string,
    token: string,
  ) {
    try {
      const { data, status } = await axios.post(
        `${this.baseURlApiTrello}/checklists/${idChecklist}/checkItems?name=${name}&key=${apikey}&token=${token}`,
      );
      if (status !== 200) {
        throw new InternalServerErrorException(
          'Error to create chekitem on checklist',
        );
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ? error.message : error,
      );
    }
  }
  async deleteBoard(id: string, token: string, apiKey: string) {
    try {
      const { data } = await axios.delete(
        `${this.baseURlApiTrello}/boards/${id}?key=${apiKey}&token=${token}`,
      );
      console.log(data);
      return 'successfull deleted';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
