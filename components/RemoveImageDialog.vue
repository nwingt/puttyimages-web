<template>
  <v-dialog
    v-model="isDialogOpen"
    content-class="dialog--likecoin"
    max-width="512px"
    lazy
  >
    <v-card>
      <dialog-header
        :title="$t('RemoveImageDialog.title')"
        is-show-close-button
        @close="close"
      />
      <dialog-content>
        <p>{{ $t('RemoveImageDialog.label.notGuarantee') }}</p>
        <a>{{ $t('General.button.learnMore') }}</a>

        <v-btn
          class="remove-image-dialog__confirm-btn"
          color="error"
          block
          outline
        >
          {{ $t('RemoveImageDialog.button.confirm') }}
        </v-btn>

        <a @close="close">{{ $t('General.button.cancel') }}</a>
      </dialog-content>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogContent from '~/components/DialogContent';
import DialogHeader from '~/components/DialogHeader';

export default {
  name: 'report-image-dialog',
  components: {
    DialogContent,
    DialogHeader,
  },
  props: {
    image: {
      required: true,
      type: Object,
    },
    isOpen: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      isDialogOpen: this.isOpen,

      hasSubmitted: false,
      isSubmitting: false,

      comments: '',

      options: [
        {
          text: 'This image is violating copyright',
          value: 'violating-copyright',
        },
        {
          text: 'This image is inappropiate / abuse to others',
          value: 'inappropiate',
        },
      ],
      selectedOption: 'violating-copyright',
    };
  },
  computed: {
    transitionName() {
      return this.hasSubmitted ? 'collapsed' : null;
    },
  },
  watch: {
    isDialogOpen(isDialogOpen) {
      if (isDialogOpen) {
        this.hasSubmitted = false;
      }
      this.$emit('update:isOpen', isDialogOpen);
    },
    isOpen(isOpen) {
      this.isDialogOpen = isOpen;
    },
  },
  methods: {
    close() {
      this.isDialogOpen = false;
    },
    submit() {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.hasSubmitted = true;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/classes';

.remove-image-dialog {
  &__confirm-btn {
    height: auto;
    max-height: unset;

    :global(.btn__content) {
      white-space: nowrap;
    }
  }
}
</style>
