import {isEscapeKey, CONSTS} from './util.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const VALID_HASHTAG_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;
const IMG_SCALE_STEP = 25;
const IMG_SCALE_MAX = 100;
const IMG_SCALE_MIN = 25;

const imgUploadInput = document.querySelector('.img-upload__input');
const imgUploadOverlay = document.querySelector('.img-upload__overlay');
const imgUploadCancel = document.querySelector('.img-upload__cancel');
const imgUploadForm = document.querySelector('.img-upload__form');
const hashtagsField = document.querySelector('.text__hashtags');
const commentField = document.querySelector('.text__description');

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imgPreview = document.querySelector('.img-upload__preview').querySelector('img');

const changeScaleSmaller = () => {
  if (parseInt(scaleControlValue.value, 10) > IMG_SCALE_MIN) {
    const imgPreviewStep = (parseInt(scaleControlValue.value, 10) - IMG_SCALE_STEP) / 100;
    imgPreview.style.transform = `scale(${imgPreviewStep})`;
    scaleControlValue.value = `${imgPreviewStep * 100}%`;
  }
};

const changeScaleBigger = () => {
  if (parseInt(scaleControlValue.value, 10) < IMG_SCALE_MAX) {
    const imgPreviewStep = (parseInt(scaleControlValue.value, 10) + IMG_SCALE_STEP) / 100;
    imgPreview.style.transform = `scale(${imgPreviewStep})`;
    scaleControlValue.value = `${imgPreviewStep * 100}%`;
  }
};

scaleControlSmaller.addEventListener('click', changeScaleSmaller);
scaleControlBigger.addEventListener('click', changeScaleBigger);

const pristine = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const OnUploadOverlayOpen = () => {
  imgUploadOverlay.classList.remove('hidden');
  CONSTS.BODY.classList.add('modal-open');
  imgUploadCancel.addEventListener('click', onUploadCancel);
  document.addEventListener('keydown', onDocumentKeydown);
};

function onUploadCancel () {
  imgUploadForm.reset();
  pristine.reset();
  imgUploadOverlay.classList.add('hidden');
  CONSTS.BODY.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

const isTextFieldFocused = () => document.activeElement === hashtagsField || document.activeElement === commentField;

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt) && !isTextFieldFocused()) {
    evt.preventDefault();
    onUploadCancel();
  }
}

const normalizeHashags = (tagString) => tagString.trim().split(' ').filter((tag) => Boolean(tag.length));

const hasValidLength = (value) => normalizeHashags(value).every((hashtag) => hashtag.length <= MAX_HASHTAG_LENGTH);

const hasValidCount = (value) => normalizeHashags(value).length <= MAX_HASHTAG_COUNT;

const hasValidSymbols = (value) => normalizeHashags(value).every((hashtag) => VALID_HASHTAG_SYMBOLS.test(hashtag));

const hasUniqueTags = (value) => {
  const lowerCaseHashtags = normalizeHashags(value).map ((hashtag) => hashtag.toLowerCase());
  return lowerCaseHashtags.length === new Set(lowerCaseHashtags).size;
};

pristine.addValidator(hashtagsField, hasValidLength, `Максимальная длина одного хэш-тега ${MAX_HASHTAG_LENGTH} символов, включая решётку`, 4, true);
pristine.addValidator(hashtagsField, hasValidCount, `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов`, 3, true);
pristine.addValidator(hashtagsField, hasValidSymbols, 'Недопустимый хэш-тег', 2, true);
pristine.addValidator(hashtagsField, hasUniqueTags, 'Один и тот же хэш-тег не может быть использован дважды', 1, true);

imgUploadInput.addEventListener('change', OnUploadOverlayOpen);
imgUploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});
