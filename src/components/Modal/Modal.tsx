/**
 * @module CustomModal
 * @description A flexible, compound modal component for React Native applications.
 *
 * The CustomModal provides a composable interface for creating modals with various
 * sub-components. It uses a compound component pattern to maintain a clean and
 * flexible API.
 *
 * @example
 * ```tsx
 * <CustomModal.Root
 *   isVisible={isModalVisible}
 *   onClose={() => setModalVisible(false)}
 *   position="center"
 * >
 *   <CustomModal.Image imageUrl="https://example.com/image.jpg" />
 *   <CustomModal.Content>
 *     <CustomModal.Title>Hello World</CustomModal.Title>
 *     <CustomModal.Description>This is a modal example</CustomModal.Description>
 *   </CustomModal.Content>
 * </CustomModal.Root>
 * ```
 *
 * @component
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Modal as RNModal, Text, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { useFocusCollection } from '@AppSrc/hooks';
import { getModalStyles } from './styles';

interface ModalContextType {
  isVisible: boolean;
  onClose: () => void;
  focusedButton: string | null;
  setFocusedButton: (button: string | null) => void;
  styles: ReturnType<typeof getModalStyles>;
  registerRef: (id: string, ref: View | null) => void;
  focusItem: (id: string) => void;
  blurItem: (id: string) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const transformPosition = (position: 'top' | 'bottom' | 'center') => {
  switch (position) {
    case 'top':
      return 'flex-start';
    case 'bottom':
      return 'flex-end';
    case 'center':
      return 'center';
    default:
      return 'center';
  }
};

/**
 * Props for the Modal.Root component
 */
interface ModalProps {
  /** Controls the visibility of the modal */
  isVisible: boolean;
  /** Callback function when the modal is closed */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Currently focused button ID */
  focusedButton: string | null;
  /** Function to set the focused button */
  setFocusedButton: (button: string | null) => void;
  /** Position of the modal on screen */
  position?: 'top' | 'bottom' | 'center';
}

/**
 * Available modal class names for styling
 */
const MODAL_CLASSES = {
  OVERLAY: 'modalOverlay',
  CONTENT: 'modalContent',
  CONTENT_PADDING: 'modalContentPadding',
  IMAGE: 'modalImage',
  TITLE: 'modalTitle',
  SUBTITLE: 'modalSubtitle',
  DESCRIPTION: 'modalDescription',
} as const;

export const CustomModal = {
  /**
   * Root component that wraps the entire modal.
   * Must be used as the parent for all other CustomModal components.
   *
   * @param {ModalProps} props - The component props
   * @returns {ReactElement | null} The modal component or null if not visible
   */
  Root: ({
    isVisible,
    onClose,
    children,
    focusedButton,
    setFocusedButton,
    position = 'center',
  }: ModalProps) => {
    const styles = useThemedStyles(getModalStyles);
    const { registerRef, focusItem, blurItem } = useFocusCollection();

    if (!isVisible) {
      return null;
    }

    return (
      <ModalContext.Provider
        value={{
          isVisible,
          onClose,
          focusedButton,
          setFocusedButton,
          styles,
          registerRef,
          focusItem,
          blurItem,
        }}
      >
        <RNModal
          testID="modal"
          visible={isVisible}
          transparent
          animationType="slide"
          onRequestClose={onClose}
        >
          <View
            style={[
              styles[MODAL_CLASSES.OVERLAY],
              { justifyContent: transformPosition(position) },
            ]}
            pointerEvents="box-only"
          >
            <View style={styles[MODAL_CLASSES.CONTENT]}>{children}</View>
          </View>
        </RNModal>
      </ModalContext.Provider>
    );
  },

  /**
   * Displays an image within the modal.
   *
   * @param {Object} props - The component props
   * @param {string} props.imageUrl - URL of the image to display
   */
  Image: ({
    imageUrl,
    testID = 'modal-image',
  }: {
    imageUrl: string;
    testID?: string;
  }) => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('Modal.Image must be used within Modal.Root');
    }

    return (
      <Image
        testID={testID}
        source={{ uri: imageUrl }}
        style={context.styles[MODAL_CLASSES.IMAGE]}
        accessibilityIgnoresInvertColors
      />
    );
  },

  /**
   * Wrapper component for modal content with proper padding.
   *
   * @param {Object} props - The component props
   * @param {ReactNode} props.children - Content to display
   * @param {StyleProp<ViewStyle>} [props.style] - Additional styles to apply
   */
  Content: ({
    children,
    style,
  }: {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
  }) => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('Modal.Content must be used within Modal.Root');
    }

    return (
      <View style={[context.styles[MODAL_CLASSES.CONTENT_PADDING], style]}>
        {children}
      </View>
    );
  },

  /**
   * Displays a title in the modal with predefined styling.
   *
   * @param {Object} props - The component props
   * @param {ReactNode} props.children - Title content
   */
  Title: ({ children }: { children: ReactNode }) => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('Modal.Title must be used within Modal.Root');
    }
    return <Text style={context.styles[MODAL_CLASSES.TITLE]}>{children}</Text>;
  },

  /**
   * Displays a subtitle in the modal with predefined styling.
   *
   * @param {Object} props - The component props
   * @param {ReactNode} props.children - Subtitle content
   */
  Subtitle: ({ children }: { children: ReactNode }) => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('Modal.Subtitle must be used within Modal.Root');
    }
    return (
      <Text style={context.styles[MODAL_CLASSES.SUBTITLE]}>{children}</Text>
    );
  },

  /**
   * Displays descriptive text in the modal with predefined styling.
   *
   * @param {Object} props - The component props
   * @param {ReactNode} props.children - Description content
   */
  Description: ({ children }: { children: ReactNode }) => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('Modal.Description must be used within Modal.Root');
    }
    return (
      <Text style={context.styles[MODAL_CLASSES.DESCRIPTION]}>{children}</Text>
    );
  },
};

/**
 * Usage Examples:
 *
 * Basic Modal:
 * ```tsx
 * <CustomModal.Root isVisible={isVisible} onClose={handleClose} position="center">
 *   <CustomModal.Content>
 *     <CustomModal.Title>Welcome</CustomModal.Title>
 *     <CustomModal.Description>This is a basic modal</CustomModal.Description>
 *   </CustomModal.Content>
 * </CustomModal.Root>
 * ```
 *
 * Modal with Image:
 * ```tsx
 * <CustomModal.Root isVisible={isVisible} onClose={handleClose} position="center">
 *   <CustomModal.Image imageUrl="https://example.com/image.jpg" />
 *   <CustomModal.Content>
 *     <CustomModal.Title>Image Modal</CustomModal.Title>
 *     <CustomModal.Subtitle>With a subtitle</CustomModal.Subtitle>
 *     <CustomModal.Description>Modal with an image example</CustomModal.Description>
 *   </CustomModal.Content>
 * </CustomModal.Root>
 * ```
 */
