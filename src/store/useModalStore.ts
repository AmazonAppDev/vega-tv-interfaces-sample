import { create } from 'zustand/react';

interface ModalData {
  imageUrl: string;
}

interface ModalStore {
  isVisible: boolean;
  modalData: ModalData | null;
  openModal: (data: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  isVisible: false,
  modalData: null,
  openModal: data => set({ isVisible: true, modalData: data }),
  closeModal: () => set({ isVisible: false, modalData: null }),
}));
