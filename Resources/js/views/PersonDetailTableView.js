/*
 * Licensed to Jasig under one or more contributor license
 * agreements. See the NOTICE file distributed with this work
 * for additional information regarding copyright ownership.
 * Jasig licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var PersonDetailTableView = function (facade) {
    var app = facade, init, LocalDictionary, Styles, 
        self = Titanium.UI.createTableView(app.styles.directoryDetailAttributeTable),
        person,
        //Event Handlers
        onEmailSelect,
        onPhoneSelect,
        onMapSelect,
        emptyRow,
        isDataEmpty = false;
    init = function () {
        //Declare pointers to facade members
        LocalDictionary = app.localDictionary;
        Styles = app.styles;
        Device = app.models.deviceProxy;
        Ti.App.addEventListener(ApplicationFacade.events['STYLESHEET_UPDATED'], function (e) {
            Styles = app.styles;
        });
    };
    
    self.update = function (p) {
        //Clear the previous data from the table.
        self.data = [];
        _newData = [];
        person = p;
        
        if (!person.email.home && !person.phone.home && !person.jobTitle && !person.organization && !person.address.home) {
            if(!emptyRow) {
                emptyRow = createRow({value: LocalDictionary.noContactData});
            }
            _newData.push(emptyRow);
            isDataEmpty = true;
        }
        
        Ti.API.debug("checking user's email " + person.email.home);
        if (person.email.home) {
            var _emailRow = createRow({label: LocalDictionary.email, value: person.email.home, link: true});

            _newData.push(_emailRow);
            _emailRow.addEventListener('click', onEmailSelect);
        }
        
        Ti.API.debug("checking phone " + person.phone.home);
        if (person.phone.home) {
            var _phoneRow = createRow({label: LocalDictionary.phone, value: person.phone.home, link: true });
            _newData.push(_phoneRow);
            _phoneRow.addEventListener('click', onPhoneSelect);
        }
        
        Ti.API.debug("checking job " + person.jobTitle);
        if (person.jobTitle) {
            _newData.push(createRow({label: LocalDictionary.title, value: person.jobTitle}));
        }
        
        Ti.API.debug("checking department " + person.department);
        if (person.department) {
            _newData.push(createRow({label: LocalDictionary.department, value: person.department}));
        }
        
        Ti.API.debug("checking org " + person.organization);
        if (person.organization) {
            _newData.push(createRow({label: LocalDictionary.organization, value: person.organization}));
        }
        
        Ti.API.debug("checking address " + person.address.home);
        if (person.address.home) {
            var _addressRow = createRow({label: LocalDictionary.address, value: person.address.home, link: true });
            _newData.push(_addressRow);
            _addressRow.addEventListener('click', onMapSelect);
        }
        
        Ti.API.debug("checking url " + person.url);
        if (person.URL.home) {
            var _urlRow = createRow({label: LocalDictionary.url, value: person.URL.home, link: true});

            _newData.push(_urlRow);
            _urlRow.addEventListener('click', onUrlSelect);
        }
        self.setData(_newData);
    };
    function createRow (attributes) {
        var _row, _rowOptions, _label, _value, _valueOpts;
        //The only required param in the attributes object is value. "label" is optional but preferred.
        //The layout will change to expand the value text if there's no label with it.
        _rowOptions = _.clone(Styles.directoryDetailRow);
        
        if (!attributes.label) {
            _rowOptions.className = 'personDataNoLabel';
        }
        else {
            _label = Titanium.UI.createLabel(Styles.directoryDetailRowLabel);
            _label.text = attributes.label;
            _label.data = attributes.value;
            
            _rowOptions.className = 'personData';
        }
        _rowOptions.data = attributes.value;
        _row = Titanium.UI.createTableViewRow(_rowOptions);        
        if (attributes.label) { 
            _row.add(_label);
            _valueOpts = _.clone(Styles.directoryDetailRowValue);
        }
        else {
            _valueOpts = _.clone(Styles.directoryDetailValueNoLabel);
        }
        
        _valueOpts.text = attributes.value;
        _valueOpts.data = attributes.value;
        if (attributes.link) { 
            Ti.API.debug("Creating a link label for " + attributes.value);
            _valueOpts.color = Styles.directoryLinkLabel.color;
        }
        _value = Titanium.UI.createLabel(_valueOpts);
        _row.add(_value);
        
        return _row;
    }
    onEmailSelect = function (e) {
        var _address;
        Ti.API.info("onEmailSelect()" + e.source.data);
        if(Device.isIOS()) {
            var emailDialog = Ti.UI.createEmailDialog({
                toRecipients: [e.source.data]
            });
            emailDialog.open();
        }
        else {
            Ti.Platform.openURL('mailto:' + e.source.data);
        }
    };
    
    onPhoneSelect = function (e) {
        var url = 'tel:' + e.source.data.replace(/[^0-9]/g, '');
        Ti.API.info(url);
        Ti.Platform.openURL(url);
    };
    
    onMapSelect = function (e) {
        var url = 'http://maps.google.com/maps?q=' + e.source.data.replace('$', ' ');
        Ti.API.debug('Opening map url ' + url);
        Ti.Platform.openURL(url);
    };
    
    onUrlSelect = function (e) {
        Ti.Platform.openURL(e.source.data);
    };
    
    init();
    
    return self;
};