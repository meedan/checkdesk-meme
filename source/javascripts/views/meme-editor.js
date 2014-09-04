/*
* MemeEditorView
* Manages form capture, model updates, and selection state of the editor form.
*/
MEME.MemeEditorView = Backbone.View.extend({

  initialize: function() {
    this.buildForms();
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  // Builds all form options based on model option arrays:
  buildForms: function() {
    var d = this.model.toJSON();

    if (d.textShadowEdit) {
      $('#text-shadow').parent().show();
    }

    // Build text alignment options:
    if (d.textAlignOpts && d.textAlignOpts.length) {
      var alignOpts = _.reduce(d.textAlignOpts, function(memo, opt) {
        return memo += ['<option value="', opt, '">Align ', opt, '</option>'].join('');
      }, '');

      $('#text-align').append(alignOpts).show();
    }

    // Build font size options:
    if (d.fontSizeOpts && d.fontSizeOpts.length) {
      var sizeLabels = ['Small', 'Medium', 'Large', 'Massive'];
      var sizeOpts = _.reduce(d.fontSizeOpts, function(memo, opt, index) {
        return memo += ['<option value="', opt, '">', sizeLabels[index], ' text</option>'].join('');
      }, '');

      $('#font-size').append(sizeOpts).show();
    }

    // Build font family options:
    if (d.fontFamilyOpts && d.fontFamilyOpts.length) {
      var familyOpts = _.reduce(d.fontFamilyOpts, function(memo, opt) {
        return memo += ['<option value="', opt, '">', opt, '</option>'].join('');
      }, '');

      $('#font-family').append(familyOpts).show();
    }

    if (d.overlayColorOpts && d.overlayColorOpts.length) {
      var overlayOpts = _.reduce(d.overlayColorOpts, function(memo, opt) {
        return memo += '<li><label><input class="m-editor__swatch" style="background-color:'+opt+'" type="radio" name="overlay" value="'+opt+'"></label></li>';
      }, '');

      $('#overlay').show().find('ul').append(overlayOpts);
    }
  },

  render: function() {
    var d = this.model.toJSON();
    $('#headline').val(d.headlineText);
    $('#credit').val(d.creditText);
    $('#image-scale').val(d.imageScale);
    $('#font-size').val(d.fontSize);
    $('#font-family').val(d.fontFamily);
    $('#text-align').val(d.textAlign);
    $('#text-shadow').prop('checked', d.textShadow);
    $('#overlay').find('[value="'+d.overlayColor+'"]').prop('checked', true);
  },

  events: {
    'input #headline': 'onHeadline',
    'input #font-size': 'onFontSize',
    'input #font-family': 'onFontFamily',
    'input #credit': 'onCredit',
    'input #image-scale': 'onScale',
    'input #text-align': 'onTextAlign',
    'change #text-shadow': 'onTextShadow',
    'change [name="overlay"]': 'onOverlayColor',
    'dragover #dropzone': 'onZoneOver',
    'dragleave #dropzone': 'onZoneOut',
    'drop #dropzone': 'onZoneDrop'
  },

  onCredit: function() {
    this.model.set('creditText', this.$('#credit').val());
  },

  onHeadline: function() {
    this.model.set('headlineText', this.$('#headline').val());
  },

  onTextAlign: function() {
    this.model.set('textAlign', this.$('#text-align').val());
  },

  onTextShadow: function() {
    this.model.set('textShadow', this.$('#text-shadow').prop('checked'));
  },

  onFontSize: function() {
    this.model.set('fontSize', this.$('#font-size').val());
  },

  onFontFamily: function() {
    this.model.set('fontFamily', this.$('#font-family').val());
  },

  onScale: function() {
    this.model.set('imageScale', this.$('#image-scale').val());
  },

  onOverlayColor: function(evt) {
    this.model.set('overlayColor', this.$(evt.target).val());
  },

  getDataTransfer: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return evt.originalEvent.dataTransfer || null;
  },

  onZoneOver: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      dataTransfer.dropEffect = 'copy';
      $('#dropzone').addClass('pulse');
    }
  },

  onZoneOut: function(evt) {
    $('#dropzone').removeClass('pulse');
  },

  onZoneDrop: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      this.model.loadBackground(dataTransfer.files[0]);
      $('#dropzone').removeClass('pulse');
    }
  }
});