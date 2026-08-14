-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Client_particulier`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Client_particulier` (
  `idClient` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(45) NOT NULL,
  `code_postal` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idClient`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Categorie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Categorie` (
  `idcategorie` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(45) NOT NULL,
  `co2_evite_kg` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`idcategorie`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`sous_categorie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`sous_categorie` (
  `idsous_categorie` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(45) NOT NULL,
  `idcategorie` INT NULL,
  PRIMARY KEY (`idsous_categorie`),
  INDEX `fk_Sous_Categorie_idx` (`idcategorie` ASC),
  CONSTRAINT `fk_Sous_Categorie`
    FOREIGN KEY (`idcategorie`)
    REFERENCES `mydb`.`Categorie` (`idcategorie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Produit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Produit` (
  `idProduit` INT NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `etat` VARCHAR(45) NOT NULL,
  `prix` DECIMAL(10,2) NOT NULL,
  `statut` VARCHAR(45) NOT NULL,
  `Client_particulier_idClient` INT NOT NULL,
  `id_sous_categorie` INT NOT NULL,
  PRIMARY KEY (`idProduit`),
  INDEX `fk_Produit_Client_particulier_idx` (`Client_particulier_idClient` ASC),
  INDEX `fk_produit_vers_sous_categorie_idx` (`id_sous_categorie` ASC),
  CONSTRAINT `fk_Produit_Client_particulier`
    FOREIGN KEY (`Client_particulier_idClient`)
    REFERENCES `mydb`.`Client_particulier` (`idClient`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_produit_vers_sous_categorie`
    FOREIGN KEY (`id_sous_categorie`)
    REFERENCES `mydb`.`sous_categorie` (`idsous_categorie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Don`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Don` (
  `idDon` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `statut` VARCHAR(45) NOT NULL,
  `Produit_idProduit` INT NOT NULL,
  `idClient` INT NOT NULL,
  `lieu_echange` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idDon`),
  INDEX `fk_Produit_idx` (`Produit_idProduit` ASC),
  INDEX `fk_Client_particulier_idx` (`idClient` ASC),
  CONSTRAINT `fk_Produit`
    FOREIGN KEY (`Produit_idProduit`)
    REFERENCES `mydb`.`Produit` (`idProduit`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Client_particulier`
    FOREIGN KEY (`idClient`)
    REFERENCES `mydb`.`Client_particulier` (`idClient`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Achat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Achat` (
  `idAchat` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `statut` VARCHAR(45) NOT NULL,
  `prix` DECIMAL(10,2) NOT NULL,
  `commission` DECIMAL(10,2) NOT NULL,
  `montant_vendeur` DECIMAL(10,2) NOT NULL,
  `Produit_idProduit` INT NOT NULL,
  `idClient` INT NOT NULL,
  `lieu_echange` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idAchat`),
  INDEX `fk_Achat_Produit1_idx` (`Produit_idProduit` ASC),
  INDEX `fk_Achat_Produits1_idx` (`idClient` ASC),
  CONSTRAINT `fk_Achat_Produit1`
    FOREIGN KEY (`Produit_idProduit`)
    REFERENCES `mydb`.`Produit` (`idProduit`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Achat_Produits1`
    FOREIGN KEY (`idClient`)
    REFERENCES `mydb`.`Client_particulier` (`idClient`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Location`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Location` (
  `idLocation` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `creneau` VARCHAR(45) NOT NULL,
  `lieu_echange` VARCHAR(45) NOT NULL,
  `statut` VARCHAR(45) NOT NULL,
  `tarif_jour` DECIMAL(10,2) NOT NULL,
  `Produit_idProduit` INT NOT NULL,
  `idClient` INT NOT NULL,
  `commission` DECIMAL(10,2) NOT NULL,
  `montant_vendeur` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`idLocation`),
  INDEX `fk_Produit_idx` (`Produit_idProduit` ASC),
  INDEX `fk_Client_particulier_idx` (`idClient` ASC),
  CONSTRAINT `fk_Location_Produit`
    FOREIGN KEY (`Produit_idProduit`)
    REFERENCES `mydb`.`Produit` (`idProduit`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Location_Client`
    FOREIGN KEY (`idClient`)
    REFERENCES `mydb`.`Client_particulier` (`idClient`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
