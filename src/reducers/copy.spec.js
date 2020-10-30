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
import chai from 'chai';
import fs from 'fs';
import path from 'path';
import {MarcRecord} from '@natlibfi/marc-record';
import createReducer, { excludeSubfields } from './copy';
import fixturesFactory, {READERS} from '@natlibfi/fixura';

MarcRecord.setValidationOptions({subfieldValues: false});

describe('reducers/copy', () => {
  const {expect} = chai;
  const fixturesPath = path.join(__dirname, '..', '..', 'test-fixtures', 'reducers', 'copy');

  fs.readdirSync(fixturesPath).forEach(subDir => {
    const {getFixture} = fixturesFactory({root: [fixturesPath, subDir], reader: READERS.JSON, failWhenNotFound: false});
    it(subDir, () => {
      const base = new MarcRecord(getFixture('base.json'));
      const source = new MarcRecord(getFixture('source.json'));
      const tagPattern = new RegExp(getFixture({components: ['tagPattern.txt'], reader: READERS.TEXT}), 'u');
      const compareTagsOnly = getCompareTagsOnly();
      const excludeSubfields = getExcludeSubfields();
      const expectedRecord = getFixture('merged.json');
      const mergedRecord = createReducer({tagPattern: tagPattern, compareTagsOnly, excludeSubfields})(base, source);
      expect(mergedRecord.toObject()).to.eql(expectedRecord);

      function getCompareTagsOnly() {
        const functionName = getFixture({components: ['compareTagsOnly.txt'], reader: READERS.TEXT});
        return functionName === 'true' ? 'true' : undefined;
      }
      // Is this the right way to do it?
      // I want to check whether excludeSubfields.txt exists and if it does, return its contents. If not, do nothing.
      function getExcludeSubfields() {
        const subfieldsToExclude = new String(getFixture({components: ['excludeSubfields.txt'], reader: READERS.TEXT}), 'u');
        return subfieldsToExclude ? subfieldsToExclude : undefined;
      }
    });
  });
});
