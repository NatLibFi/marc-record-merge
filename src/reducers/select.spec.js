/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* Merge MARC records
*
* Copyright (C) 2015-2019 University Of Helsinki (The National Library Of Finland)
*
* This file is part of marc-record-merge-js

* marc-record-merge-js program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* marc-record-merge-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/
import createDebugLogger from 'debug';
import chai from 'chai';
import fs from 'fs';
import path from 'path';
import {MarcRecord} from '@natlibfi/marc-record';
import createReducer from './select';
import fixturesFactory, {READERS} from '@natlibfi/fixura';

MarcRecord.setValidationOptions({subfieldValues: false});

describe('reducers/select', () => {
  const debug = createDebugLogger('@natlibfi/marc-record-merge');
  const {expect} = chai;
  const fixturesPath = path.join(__dirname, '..', '..', 'test-fixtures', 'reducers', 'select');

  fs.readdirSync(fixturesPath).forEach(subDir => {
    const {getFixture} = fixturesFactory({root: [fixturesPath, subDir], reader: READERS.JSON, failWhenNotFound: false});
    it(subDir, () => {
      const baseTest = new MarcRecord(getFixture('base.json'));
      const sourceTest = new MarcRecord(getFixture('source.json'));
      const patternTest = new RegExp(getFixture({components: ['pattern.txt'], reader: READERS.TEXT}), 'u');
      const expectedRecord = getFixture('merged.json');
      const expectedError = getFixture({components: ['expected-error.txt'], reader: READERS.TEXT});
      if (expectedError) {
        debug(`Handling expectedError`);
        expect(() => createReducer.to.throw(Error, 'control field'));
        return;
      }
      const mergedRecord = createReducer(patternTest)(baseTest, sourceTest);
      expect(mergedRecord.toObject()).to.eql(expectedRecord);
    });
  });
});
